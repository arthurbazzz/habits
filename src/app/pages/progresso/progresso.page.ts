import { Component, computed, inject } from '@angular/core';
import { HabitoService } from '../../services/habito.service';
import { ultimosDias } from '../../services/datas';

@Component({ selector: 'app-progresso', standalone: false, templateUrl: './progresso.page.html', styleUrls: ['./progresso.page.scss'] })
export class ProgressoPage {
  readonly habitoServ = inject(HabitoService);

  /** Percentual de hábitos concluídos em cada um dos últimos 7 dias. */
  readonly historico = computed(() => {
    const habitos = this.habitoServ.habitos();
    return ultimosDias(7).map(dia => {
      const feitos = habitos.filter(h => this.habitoServ.concluido(h, dia)).length;
      return { rotulo: `${dia.getDate()}/${dia.getMonth() + 1}`, pct: habitos.length ? feitos / habitos.length : 0 };
    });
  });

  readonly ranking = computed(() =>
    [...this.habitoServ.habitos()].sort((a, b) => this.habitoServ.sequencia(b) - this.habitoServ.sequencia(a)));
}
