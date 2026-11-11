import { Component, computed, inject, signal } from '@angular/core';
import { CATEGORIAS, IHabito } from '../../../models/habito.model';
import { HabitoService } from '../../services/habito.service';

@Component({ selector: 'app-habitos', standalone: false, templateUrl: './habitos.page.html', styleUrls: ['./habitos.page.scss'] })
export class HabitosPage {
  readonly habitoServ = inject(HabitoService);
  readonly filtros = ['Todos', ...CATEGORIAS];
  readonly filtro = signal('Todos');
  readonly busca = signal('');
  readonly buscando = signal(false);

  readonly lista = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    return this.habitoServ.habitos().filter(h =>
      (this.filtro() === 'Todos' || h.categoria === this.filtro()) && h.nome.toLowerCase().includes(termo));
  });

  alternarBusca(): void {
    this.buscando.update(v => !v);
    if (!this.buscando()) this.busca.set('');
  }

  percentual(habito: IHabito): number {
    return Math.min(100, (this.habitoServ.progresso(habito) / habito.meta) * 100);
  }
}
