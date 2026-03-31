import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { CadastroPropriedadeService } from './cadastro-propriedade.service';
import { AuthService } from './auth.service';

// Redireciona para /cadastro-propriedade se o usuário
// ainda não tiver nenhuma propriedade cadastrada
export const propriedadeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const propriedadeService = inject(CadastroPropriedadeService);
  const router = inject(Router);

  // Se não está logado, manda pro login
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return of(false);
  }

  return propriedadeService.getMinhas().pipe(
    map(res => {
      if (res.count > 0) {
        return true; // tem propriedade, pode acessar
      }
      router.navigate(['/cadastro-propriedade']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/cadastro-propriedade']);
      return of(false);
    })
  );
};
