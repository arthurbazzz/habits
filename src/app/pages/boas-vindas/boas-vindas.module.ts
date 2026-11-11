import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { BoasVindasPage } from './boas-vindas.page';

@NgModule({ declarations: [BoasVindasPage], imports: [IonContent, RouterModule.forChild([{ path: '', component: BoasVindasPage }])] })
export class BoasVindasPageModule {}
