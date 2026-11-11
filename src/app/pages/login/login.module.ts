import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonIcon, IonInput } from '@ionic/angular';
import { LoginPage } from './login.page';

@NgModule({ declarations: [LoginPage], imports: [FormsModule, IonContent, IonIcon, IonInput, RouterModule.forChild([{ path: '', component: LoginPage }])] })
export class LoginPageModule {}
