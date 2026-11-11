import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { TabsPage } from './tabs.page';

@NgModule({
  declarations: [TabsPage],
  imports: [IonTabs, IonTabBar, IonTabButton, RouterModule.forChild([{
    path: '', component: TabsPage, children: [
      { path: 'inicio', loadChildren: () => import('../inicio/inicio.module').then(m => m.InicioPageModule) },
      { path: 'habitos', loadChildren: () => import('../habitos/habitos.module').then(m => m.HabitosPageModule) },
      { path: 'progresso', loadChildren: () => import('../progresso/progresso.module').then(m => m.ProgressoPageModule) },
      { path: 'perfil', loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule) },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    ],
  }])],
})
export class TabsPageModule {}
