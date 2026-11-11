import { Component, inject, signal } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({ selector: 'app-login', standalone: false, templateUrl: './login.page.html' })
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);
  email = '';
  senha = '';
  readonly erro = signal('');
  readonly enviando = signal(false);

  async entrarComGoogle(): Promise<void> {
    this.enviando.set(true);
    try {
      await this.auth.entrarComGoogle();
      await this.nav.navigateRoot('/tabs/inicio');
    } catch (e) {
      this.erro.set((e as Error).message);
    } finally {
      this.enviando.set(false);
    }
  }

  async entrar(): Promise<void> {
    this.enviando.set(true);
    try {
      await this.auth.entrar(this.email, this.senha);
      await this.nav.navigateRoot('/tabs/inicio');
    } catch (e) {
      this.erro.set((e as Error).message);
    } finally {
      this.enviando.set(false);
    }
  }
}
