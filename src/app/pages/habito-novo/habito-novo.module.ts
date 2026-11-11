import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonInput } from '@ionic/angular';
import { HabitoNovoPage } from './habito-novo.page';

@NgModule({ declarations: [HabitoNovoPage], imports: [FormsModule, IonContent, IonInput, RouterModule.forChild([{ path: '', component: HabitoNovoPage }])] })
export class HabitoNovoPageModule {}
