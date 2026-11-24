
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  hardwareChipOutline,
  wifiOutline,
  serverOutline
} from 'ionicons/icons';

import { MqttService } from '../services/mqtt.service';

@Component({
  selector: 'app-connection',
  standalone: true,
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonIcon
  ],
})
export class ConnectionPage {

  constructor(public mqttService: MqttService, private cdr: ChangeDetectorRef) {
    addIcons({
      hardwareChipOutline,
      wifiOutline,
      serverOutline
    });
  }

  conectar() {
    console.log('[PÁGINA] Antes:', this.mqttService.isConnected);

  this.mqttService.conectar();

  console.log('[PÁGINA] Depois:', this.mqttService.isConnected);

    setTimeout(() => {
    this.cdr.detectChanges();
  }, 1000);
  }

  desconectar() {
    this.mqttService.desconectar();
  }
}
