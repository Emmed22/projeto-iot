
import { Component } from '@angular/core';
import { addIcons } from 'ionicons';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonItem,
  IonInput
} from '@ionic/angular';

import{
  hardwareChipOutline, cloudOfflineOutline,
  thermometerOutline,
  waterOutline,
  bulbOutline,
  wifiOutline
} from 'ionicons/icons';
import { MqttService } from '../services/mqtt.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonItem,
    IonInput
  ],
})
export class HomePage {
 
  constructor(public mqttService: MqttService ) {
    addIcons({
      'hardware-chip-outline': hardwareChipOutline,
      'cloud-offline-outline': cloudOfflineOutline,
      'thermometer-outline': thermometerOutline,
      'water-outline': waterOutline,
      'bulb-outline': bulbOutline,
      'wifi-outline': wifiOutline
    });
    
  }
  
}
