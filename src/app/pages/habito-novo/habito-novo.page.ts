import { Component, inject, signal } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CATEGORIAS, FREQUENCIAS, ICONES, createIHabito } from '../../../models/habito.model';
import { HabitoService } from '../../services/habito.service';

@Component({ selector: 'app-habito-novo', standalone: false, templateUrl: './habito-novo.page.html', styleUrls: ['./habito-novo.page.scss'] })
export class HabitoNovoPage {
  private readonly habitoServ = inject(HabitoService);
  readonly nav = inject(NavController);
  readonly icones = ICONES;
  readonly categorias = CATEGORIAS;
  readonly frequencias = FREQUENCIAS;
  habito = createIHabito();
  readonly erro = signal('');

  ionViewWillEnter(): void {
    this.habito = createIHabito();
    this.erro.set('');
  }

  alterarMeta(delta: number): void {
    this.habito.meta = Math.max(1, this.habito.meta + delta);
  }

  async criar(): Promise<void> {
    try {
      const novo = await this.habitoServ.add(this.habito);
      // Tira o formulário da pilha antes de abrir o detalhe, para o "voltar" cair nas abas.
      await this.nav.navigateBack('/tabs/inicio', { animated: false });
      await this.nav.navigateForward(['/habito', novo.id]);
    } catch (e) {
      this.erro.set((e as Error).message);
    }
  }
}
