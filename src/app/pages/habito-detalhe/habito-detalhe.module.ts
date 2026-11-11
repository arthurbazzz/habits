import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonFooter } from '@ionic/angular';
import { HabitoDetalhePage } from './habito-detalhe.page';

@NgModule({ declarations: [HabitoDetalhePage], imports: [IonContent, IonFooter, RouterModule.forChild([{ path: '', component: HabitoDetalhePage }])] })
export class HabitoDetalhePageModule {}
