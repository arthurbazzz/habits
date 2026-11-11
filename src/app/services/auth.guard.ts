import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// inject() só funciona antes do primeiro await, por isso o Router é obtido logo no início.
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.iniciar();
  return auth.usuario() ? true : router.createUrlTree(['/boas-vindas']);
};

export const visitanteGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.iniciar();
  return auth.usuario() ? router.createUrlTree(['/tabs/inicio']) : true;
};
