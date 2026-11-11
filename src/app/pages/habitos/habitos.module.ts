import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonSearchbar } from '@ionic/angular';
import { HabitosPage } from './habitos.page';

@NgModule({ declarations: [HabitosPage], imports: [FormsModule, IonContent, IonSearchbar, RouterModule.forChild([{ path: '', component: HabitosPage }])] })
export class HabitosPageModule {}
