import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { propriedadeGuard } from './services/propriedade.guard';
import { parametrosGuard } from './services/parametros.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'cadastro-conta',
    loadComponent: () => import('./pages/cadastro-conta/cadastro-conta.component').then((m) => m.CadastroContaComponent),
  },
  {
    path: 'cadastro-propriedade',
    loadComponent: () =>
      import('./pages/cadastro-propriedade/cadastro-propriedade.component').then(m => m.CadastroPropriedadeComponent),
    canActivate: [authGuard], // 🔒 precisa estar logado
  },
  {
    path: 'cadastro-parametros',
    loadComponent: () =>
      import('./pages/cadastro-parametros/cadastro-parametros.component').then(m => m.CadastroParametrosComponent),
    canActivate: [authGuard, propriedadeGuard], // 🔒 precisa ter propriedade antes
  },
  {
    path: 'data-parametros',
    loadComponent: () =>
      import('./pages/data-parametros/data-parametros.component').then(m => m.DataParametrosPage),
    canActivate: [authGuard, propriedadeGuard, parametrosGuard], // 🔒 logado + propriedade + parâmetros
  },
  {
    path: 'meus-dados',
    loadComponent: () => import('./pages/meus-dados/meus-dados.component')
      .then(m => m.MeusDadosComponent)
  },
  {
    path: 'detalhe-estatistica',
    loadComponent: () =>
      import('./pages/detalhe-estatistica/detalhe-estatistica.component').then(
        m => m.DetalheEstatisticaPage
      ),
  },
  { path: 'esqueci-senha', loadComponent: () => import('./pages/esqueci-senha/esqueci-senha.component').then(m => m.EsqueciSenhaComponent) },
  { path: 'redefinir-senha/:token', loadComponent: () => import('./pages/redefinir-senha/redefinir-senha.component').then(m => m.RedefinirSenhaComponent) },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
