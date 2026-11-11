import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonIcon, IonInput } from '@ionic/angular';
import { CadastroPage } from './cadastro.page';

@NgModule({ declarations: [CadastroPage], imports: [FormsModule, IonContent, IonIcon, IonInput, RouterModule.forChild([{ path: '', component: CadastroPage }])] })
export class CadastroPageModule {}
