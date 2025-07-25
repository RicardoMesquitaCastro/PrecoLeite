import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
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
    loadComponent: () => import('./pages/cadastro-propriedade/cadastro-propriedade.component').then((m) => m.CadastroPropriedadeComponent),
  },
    {
    path: 'data-parametros',
    loadComponent: () => import('./pages/data-parametros/data-parametros.component').then((m) => m.DataParametrosPage),
  },
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
