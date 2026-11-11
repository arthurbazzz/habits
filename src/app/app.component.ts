import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';

addIcons({ logoGoogle });

@Component({ selector: 'app-root', standalone: false, template: '<ion-app><ion-router-outlet /></ion-app>' })
export class AppComponent {}
