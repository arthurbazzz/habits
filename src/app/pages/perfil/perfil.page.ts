import { Component, computed, inject } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { HabitoService } from '../../services/habito.service';

const XP_POR_CHECKIN = 20;
const XP_POR_NIVEL = 1200;

@Component({ selector: 'app-perfil', standalone: false, templateUrl: './perfil.page.html', styleUrls: ['./perfil.page.scss'] })
export class PerfilPage {
  readonly auth = inject(AuthService);
  readonly habitoServ = inject(HabitoService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);
  private readonly nav = inject(NavController);
  readonly xpPorNivel = XP_POR_NIVEL;

  readonly xpTotal = computed(() => this.habitoServ.totalCheckins() * XP_POR_CHECKIN);
  readonly nivel = computed(() => Math.floor(this.xpTotal() / XP_POR_NIVEL) + 1);
  readonly xpNivel = computed(() => this.xpTotal() % XP_POR_NIVEL);

  readonly destaques = computed(() => {
    const melhor = this.habitoServ.melhorSequenciaGeral();
    return [
      { dias: 7, emoji: '🔥', texto: 'Continue!' },
      { dias: 14, emoji: '🔥', texto: 'Em Chamas!' },
      { dias: 30, emoji: '⚡', texto: 'Super Streak' },
      { dias: 60, emoji: '🔥', texto: 'Imparável' },
    ].map(d => ({ ...d, liberado: melhor >= d.dias, emoji: melhor >= d.dias ? d.emoji : '🔒' }));
  });

  readonly medalhas = computed(() => {
    const habitos = this.habitoServ.habitos();
    const feitos = habitos.filter(h => this.habitoServ.totalDias(h) > 0);
    return [
      { nome: 'Primeiro Passo', icone: 'badge-alert', ganhou: feitos.length > 0 },
      { nome: '7 Dias Seguidos', icone: 'badge-alert', ganhou: this.habitoServ.melhorSequenciaGeral() >= 7 },
      { nome: 'Madrugador', icone: 'badge-percent', ganhou: feitos.some(h => h.horario < '07:00') },
      { nome: 'Coruja da Noite', icone: 'badge-alert', ganhou: feitos.some(h => h.horario >= '22:00') },
      { nome: 'Super Hidratado', icone: 'badge-alert', ganhou: habitos.some(h => /água|agua/i.test(h.nome) && this.habitoServ.melhorSequencia(h) >= 7) },
    ];
  });

  async editarPerfil(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar Perfil',
      inputs: [{ name: 'nome', value: this.auth.usuario()?.nome, placeholder: 'Seu nome' }],
      buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Salvar', handler: (d: { nome: string }) => { void this.auth.atualizarNome(d.nome); } }],
    });
    await alert.present();
  }

  exportar(): void {
    const blob = new Blob([this.habitoServ.exportar()], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'habits.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async emBreve(): Promise<void> {
    const toast = await this.toastCtrl.create({ message: 'Disponível em breve 🐼', duration: 1500, position: 'top' });
    await toast.present();
  }

  async sair(): Promise<void> {
    await this.auth.sair();
    await this.nav.navigateRoot('/boas-vindas');
  }
}
