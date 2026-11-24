# IoT Control – ESP32 Monitor

Aplicativo desenvolvido como projeto acadêmico de IoT para monitoramento e controle de um ESP32 por meio do protocolo MQTT, utilizando o broker HiveMQ Cloud.

## Tecnologias utilizadas

- **Ionic:** desenvolvimento da interface do aplicativo.
- **Angular:** estrutura da aplicação.
- **TypeScript:** linguagem de programação.
- **SCSS:** estilização das páginas.
- **MQTT.js:** biblioteca utilizada para comunicação MQTT.
- **HiveMQ Cloud:** broker MQTT responsável pela comunicação entre o aplicativo e o ESP32.

## Funcionalidades

- **Conexão MQTT:** configuração do servidor, porta, usuário e senha, com indicadores de conexão.
- **Monitoramento:** exibição de temperatura (°C) e umidade (%).
- **Controle do LED:** envio de comandos para ligar e desligar o LED e recebimento do estado informado pelo ESP32.
- **Display LCD:** envio de nome e mensagem para o display do dispositivo.
- **Status do dispositivo:** indicação de disponibilidade do ESP32.
- **Tratamento de conexão:** mensagens de erro e tentativa automática de reconexão.

## Comunicação MQTT

A comunicação utiliza conexão segura via WebSocket TLS.

- **Broker:** HiveMQ Cloud
- **Porta:** 8884
- **Caminho WebSocket:** `/mqtt`
- **Protocolo:** MQTT 3.1.1

### Tópicos utilizados

| Tópico | Finalidade |
|---|---|
| `iotaula/mariana-duarte-e-luna-alves/led/set` | Envio de comandos ON/OFF |
| `iotaula/mariana-duarte-e-luna-alves/led/state` | Recebimento do estado real do LED |
| `iotaula/mariana-duarte-e-luna-alves/msg` | Envio de mensagens para o LCD |
| `iotaula/mariana-duarte-e-luna-alves/temp` | Recebimento de temperatura e umidade |
| `iotaula/mariana-duarte-e-luna-alves/status` | Recebimento do status do ESP32 |

## Como executar o projeto

### Pré-requisitos

- Node.js e npm instalados.
- Git instalado.
- Ionic CLI instalado.

### 1. Clonar o repositório

```bash
git clone https://github.com/Emmed22/projeto-iot.git
```

### 2. Acessar a pasta do projeto

```bash
cd projeto-iot
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Executar o aplicativo

```bash
ionic serve
```

O aplicativo será disponibilizado no navegador, normalmente em `http://localhost:8100`.

## Configuração da conexão

Na página de conexão do aplicativo, informe as credenciais disponibilizadas para acesso ao HiveMQ Cloud.

A senha deve ser inserida diretamente na interface de conexão, sem ser armazenada ou publicada no repositório.

## Observação

O funcionamento das funcionalidades que dependem do hardware está condicionado à conexão e à configuração correta do ESP32 no broker MQTT, utilizando os mesmos tópicos definidos no aplicativo.

---

**Desenvolvimento:** Mariana Duarte e Luna Alves  
**Projeto acadêmico:** IoT – Aplicativo Mobile + ESP32 via MQTT