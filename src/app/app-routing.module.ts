import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard, visitanteGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tabs/inicio', pathMatch: 'full' },
  { path: 'boas-vindas', canActivate: [visitanteGuard], loadChildren: () => import('./pages/boas-vindas/boas-vindas.module').then(m => m.BoasVindasPageModule) },
  { path: 'login', canActivate: [visitanteGuard], loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'cadastro', canActivate: [visitanteGuard], loadChildren: () => import('./pages/cadastro/cadastro.module').then(m => m.CadastroPageModule) },
  { path: 'tabs', canActivate: [authGuard], loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'habito-novo', canActivate: [authGuard], loadChildren: () => import('./pages/habito-novo/habito-novo.module').then(m => m.HabitoNovoPageModule) },
  { path: 'habito/:id', canActivate: [authGuard], loadChildren: () => import('./pages/habito-detalhe/habito-detalhe.module').then(m => m.HabitoDetalhePageModule) },
  { path: '**', redirectTo: 'tabs/inicio' },
];

@NgModule({ imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, bindToComponentInputs: true })], exports: [RouterModule] })
export class AppRoutingModule {}
