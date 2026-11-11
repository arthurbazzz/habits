import { Component, computed, inject, input } from '@angular/core';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { Categoria } from '../../../models/habito.model';
import { HabitoService } from '../../services/habito.service';
import { semanaAtual, ultimosDias } from '../../services/datas';

const MENSAGENS: Record<Categoria, string> = {
  'Saúde': 'Cuidar da saúde é cuidar de você! Continue assim!',
  'Fitness': 'Cada treino conta. Bora manter o ritmo!',
  'Estudo': 'Um pouco por dia vira muito no fim do mês!',
  'Bem-estar': 'Respira fundo, você está indo muito bem!',
  'Finanças': 'Pequenas economias, grandes conquistas!',
};
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

@Component({ selector: 'app-habito-detalhe', standalone: false, templateUrl: './habito-detalhe.page.html', styleUrls: ['./habito-detalhe.page.scss'] })
export class HabitoDetalhePage {
  readonly habitoServ = inject(HabitoService);
  readonly nav = inject(NavController);
  private readonly actionSheet = inject(ActionSheetController);
  private readonly alertCtrl = inject(AlertController);
  readonly id = input.required<string>();

  readonly habito = computed(() => this.habitoServ.get(this.id()));
  readonly mensagem = computed(() => MENSAGENS[this.habito()?.categoria ?? 'Saúde']);

  readonly semana = computed(() => {
    const h = this.habito();
    return semanaAtual().map((dia, i) => ({ rotulo: DIAS[i], feito: !!h && this.habitoServ.concluido(h, dia) }));
  });
  readonly feitosSemana = computed(() => this.semana().filter(d => d.feito).length);

  readonly historico = computed(() => {
    const h = this.habito();
    return ultimosDias(7).map(dia => ({
      rotulo: `${dia.getDate()}/${dia.getMonth() + 1}`,
      altura: h ? 4 + Math.min(1, this.habitoServ.progresso(h, dia) / h.meta) * 76 : 4,
    }));
  });

  async editarHorario(): Promise<void> {
    const h = this.habito();
    if (!h) return;
    const alert = await this.alertCtrl.create({
      header: 'Lembrete',
      inputs: [{ name: 'horario', type: 'time', value: h.horario }],
      buttons: [{ text: 'Cancelar', role: 'cancel' }, {
        text: 'Salvar', handler: (d: { horario: string }) => { if (d.horario) void this.habitoServ.update({ ...h, horario: d.horario }); },
      }],
    });
    await alert.present();
  }

  async opcoes(): Promise<void> {
    const h = this.habito();
    if (!h) return;
    const sheet = await this.actionSheet.create({
      header: h.nome,
      buttons: [
        { text: 'Excluir hábito', role: 'destructive', handler: () => { void this.habitoServ.delete(h.id).then(() => this.nav.navigateBack('/tabs/habitos')); } },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await sheet.present();
  }
}
