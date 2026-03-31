import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { CadastroParametrosService } from './cadastro-parametros.service';
import { AuthService } from './auth.service';

// Redireciona para /cadastro-parametros se o usuário
// ainda não tiver nenhum parâmetro cadastrado
export const parametrosGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const parametrosService = inject(CadastroParametrosService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return of(false);
  }

  return parametrosService.getMeus().pipe(
    map(res => {
      if (res.count > 0) {
        return true; // tem parâmetros, pode acessar
      }
      router.navigate(['/cadastro-parametros']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/cadastro-parametros']);
      return of(false);
    })
  );
};
