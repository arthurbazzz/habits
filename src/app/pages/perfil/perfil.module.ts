import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { PerfilPage } from './perfil.page';

@NgModule({ declarations: [PerfilPage], imports: [IonContent, RouterModule.forChild([{ path: '', component: PerfilPage }])] })
export class PerfilPageModule {}
