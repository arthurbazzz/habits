import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { InicioPage } from './inicio.page';

@NgModule({ declarations: [InicioPage], imports: [IonContent, RouterModule.forChild([{ path: '', component: InicioPage }])] })
export class InicioPageModule {}
