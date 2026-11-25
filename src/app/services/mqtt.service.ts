
import { Injectable, signal } from '@angular/core';
import mqtt, { type MqttClient } from 'mqtt';

@Injectable({
  providedIn: 'root'
})
export class MqttService {

  client: MqttClient | null = null;

  // Estados reativos
  isConnected = signal(false);
  isConnecting = signal(false);

  statusText = signal('Desconectado');
  statusMessage = signal('Aguardando conexão com o servidor MQTT');
  errorMessage = signal('');

  ledState = signal('OFF');
  temperature = signal<number | null>(null);
  humidity = signal<number | null>(null);
  deviceStatus = signal('offline');
  lastReading = signal<Date | null>(null);

  // Configurações
  server = '436ce1fa7ecd416c98446bce794c0d8d.s1.eu.hivemq.cloud';
  port = 8884;
  username = 'aula';
  password = '';
  topicPrefix = 'iotaula/mariana-duarte-e-luna-alves/';

  // Detecção de ESP32 offline (watchdog)
  // Se ficar esse tempo sem receber nada do ESP32, ele é marcado como offline.
  // Ajuste para ~3x o intervalo de envio da temperatura.
  private readonly TIMEOUT_ESP32_MS = 15000;
  private ultimoSinalEsp32 = 0;
  private watchdog: ReturnType<typeof setInterval> | null = null;

  private registrarSinalEsp32() {
    this.ultimoSinalEsp32 = Date.now();
    this.deviceStatus.set('online');
  }

  private iniciarWatchdog() {
    this.pararWatchdog();

    this.watchdog = setInterval(() => {
      const semSinalHa = Date.now() - this.ultimoSinalEsp32;

      if (
        this.deviceStatus() === 'online' &&
        semSinalHa > this.TIMEOUT_ESP32_MS
      ) {
        console.warn('[MQTT] ESP32 sem sinal, marcando como offline');
        this.deviceStatus.set('offline');
      }
    }, 2000);
  }

  private pararWatchdog() {
    if (this.watchdog) {
      clearInterval(this.watchdog);
      this.watchdog = null;
    }
  }

  conectar() {

    if (this.client) {
      return;
    }

    if (
      !this.server ||
      !this.username ||
      !this.password ||
      !this.topicPrefix
    ) {
      this.errorMessage.set(
        'Preencha todos os campos antes de conectar.'
      );
      return;
    }

    const brokerUrl =
      `wss://${this.server}:${this.port}/mqtt`;

      const clientId =
  `app-mariana-luna-${Math.random().toString(16).slice(2, 6)}`;

    this.errorMessage.set('');
    this.isConnecting.set(true);
    this.statusText.set('Conectando...');
    this.statusMessage.set('Estabelecendo conexão com o HiveMQ');

    try {

      const client = mqtt.connect(brokerUrl, {
        clientId,
        username: this.username,
        password: this.password,
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 3000,
        connectTimeout: 10000,
        keepalive: 30
      });

      this.client = client;

      // Conexão estabelecida
      client.on('connect', () => {

        console.log('[MQTT] Conexão estabelecida!');

        this.isConnected.set(true);
        this.isConnecting.set(false);
        this.statusText.set('Conectado');
        this.statusMessage.set('Conexão estabelecida com sucesso!');
        this.errorMessage.set('');

        // Começa assumindo offline até chegar algum sinal do ESP32
        this.deviceStatus.set('offline');
        this.ultimoSinalEsp32 = 0;
        this.iniciarWatchdog();

        const topics = [
          `${this.topicPrefix}led/state`,
          `${this.topicPrefix}temp`,
          `${this.topicPrefix}status`
        ];

        client.subscribe(topics, (error) => {

          if (error) {
            this.errorMessage.set(
              'Não foi possível assinar os tópicos.'
            );

            console.error('[MQTT] Erro ao assinar tópicos:', error);
          }

        });

      });

      // Recebimento de mensagens
      client.on('message', (topic, payload) => {

        const message = payload.toString();
        console.log('[mqtt] Mensagem recebida:', topic, message);

        if (topic === `${this.topicPrefix}led/state`) {
          this.ledState.set(message);
          this.registrarSinalEsp32();
        }

        if (topic === `${this.topicPrefix}status`) {
          if (message === 'offline') {
            // Ex.: Last Will publicado pelo broker quando o ESP32 cai
            this.deviceStatus.set('offline');
            this.ultimoSinalEsp32 = 0;
          } else {
            // 'online' conta como sinal; se for uma mensagem retida antiga
            // e nada mais chegar, o watchdog derruba depois do timeout
            this.registrarSinalEsp32();
          }
        }

        if (topic === `${this.topicPrefix}temp`) {

          try {

            const data = JSON.parse(message);

            this.temperature.set(data.t);
            this.humidity.set(data.h);
            this.lastReading.set(new Date());
            this.registrarSinalEsp32();

          } catch (error) {

            console.error(
              '[MQTT] Erro ao interpretar temperatura:',
              error
            );

          }

        }

      });

      // Reconexão
      client.on('reconnect', () => {

        this.isConnected.set(false);
        this.isConnecting.set(true);
        this.statusText.set('Reconectando...');
        this.statusMessage.set(
          'Tentando restabelecer a conexão'
        );

      });

      // Cliente offline
      client.on('offline', () => {

        this.pararWatchdog();
        this.deviceStatus.set('offline');
        this.isConnected.set(false);
        this.isConnecting.set(false);
        this.statusText.set('Offline');
        this.statusMessage.set(
          'Conexão com o servidor indisponível'
        );

      });

      // Conexão encerrada
      client.on('close', () => {

        this.pararWatchdog();
        this.deviceStatus.set('offline');
        this.isConnected.set(false);

        if (this.client === client) {
          this.isConnecting.set(false);
          this.statusText.set('Desconectado');
          this.statusMessage.set('Conexão encerrada');
        }

      });

      // Erros
      client.on('error', (error) => {

        console.error('[MQTT] Erro:', error);

        this.errorMessage.set(error.message);
        this.statusMessage.set(
          'Ocorreu um erro na conexão'
        );

      });

    } catch (error) {

      this.client = null;
      this.isConnected.set(false);
      this.isConnecting.set(false);
      this.statusText.set('Erro');
      this.statusMessage.set('Não foi possível iniciar a conexão');

      console.error('[MQTT] Erro ao iniciar:', error);

    }

  }

  desconectar() {

    this.pararWatchdog();
    this.deviceStatus.set('offline');

    if (this.client) {
      this.client.end(true);
      this.client = null;
    }

    this.isConnected.set(false);
    this.isConnecting.set(false);
    this.statusText.set('Desconectado');
    this.statusMessage.set('Você encerrou a conexão');
    this.errorMessage.set('');

  }

  publicarLed(estado: 'ON' | 'OFF') {

    if (!this.client || !this.isConnected()) {

      this.errorMessage.set(
        'Conecte ao servidor antes de controlar o LED.'
      );

      return;

    }

    this.client.publish(
      `${this.topicPrefix}led/set`,
      estado,
      { qos: 0, retain: false },
      (error) => {

        if (error) {

          this.errorMessage.set(
            'Não foi possível enviar o comando ao LED.'
          );

          console.error('[MQTT] Erro ao publicar:', error);

        }else {
          console.log('[mqtt] Comando enviado ao broker:', estado);
        }

      }
    );

  }

  publicarMensagem(
    nome: string,
    mensagem: string,
    callback?: (sucesso: boolean) => void
  ) {
    if (!this.client || !this.isConnected()){
      this.errorMessage.set(
        'Conecte ao servidor antes de enviar uma mensagem.'
      );
      callback?.(false);
      return;
    }

    const payload = JSON.stringify({
      from: nome,
      text: mensagem
    });

    this.client.publish(
      `${this.topicPrefix}msg`,
      payload,
      { qos: 0, retain: false },
      (error) => {
        if (error) {
          this.errorMessage.set('Não foi possível enviar a mensagem.');

          console.error('[mqtt] Erro ao enviar mensagem:', error);
          callback?.(false);

        } else {
          console.log('[mqtt] Mensagem enviada ao broker:', payload);
          callback?.(true);
        }
      }
    );
  }
}
