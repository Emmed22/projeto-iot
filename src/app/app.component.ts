import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonRouterOutlet, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, chatbubbleOutline, settingsOutline } from 'ionicons/icons';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonIcon, RouterLink, RouterLinkActive],
})
export class AppComponent {
  constructor() {
    addIcons({
      homeOutline,
      chatbubbleOutline,
      settingsOutline
    });
  }
}