import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ProgressoPage } from './progresso.page';

@NgModule({ declarations: [ProgressoPage], imports: [IonContent, RouterModule.forChild([{ path: '', component: ProgressoPage }])] })
export class ProgressoPageModule {}
