
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { paperPlaneOutline, hardwareChipOutline } from 'ionicons/icons';
import { MqttService } from '../services/mqtt.service';

@Component({
  selector: 'app-lcd',
  standalone: true,
  templateUrl: 'lcd.page.html',
  styleUrls: ['lcd.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonIcon
  ],
})
export class LcdPage {

  name = '';
  message = '';
  feedback = '';
  
  constructor(public mqttService: MqttService) {
   
    addIcons({
      'paper-plane-outline': paperPlaneOutline,
      'hardware-chip-outline' : hardwareChipOutline
    });
  }

  enviarMensagem() {
    const nome = this.name.trim();
    const mensagem = this.message.trim();

    if(!nome || !mensagem){
      this.feedback = 'Preencha seu nome e sua mensagem';
      return;
    }

    if(!this.mqttService.isConnected()){
      this.feedback = 'Conecte ao servidor MQTT antes de enviar.';
      return;
    }

    this.feedback = 'Enviando mensagem...';

    this.mqttService.publicarMensagem(
      nome, 
      mensagem,
      (sucesso)=>{
        if(sucesso){
          this.feedback ='Mensagem enviada ao broker!';

          this.name = '';
          this.message = '';
        } else{
          this.feedback = 'Erro ao enviar. Verifique a conexão.';
        }
      }
    );
  }
}

