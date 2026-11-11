import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HabitoService } from '../../services/habito.service';

@Component({ selector: 'app-inicio', standalone: false, templateUrl: './inicio.page.html', styleUrls: ['./inicio.page.scss'] })
export class InicioPage {
  readonly habitoServ = inject(HabitoService);
  private readonly auth = inject(AuthService);

  readonly primeiroNome = computed(() => this.auth.usuario()?.nome.split(' ')[0] ?? '');
  readonly resumo = this.habitoServ.resumoHoje;
  // Hábitos de hoje em ordem de horário, como na tela do Figma.
  readonly habitosHoje = computed(() => [...this.habitoServ.habitos()].sort((a, b) => a.horario.localeCompare(b.horario)));
  readonly saudacao = computed(() => {
    const hora = new Date().getHours();
    return hora < 12 ? 'Bom dia,' : hora < 18 ? 'Boa tarde,' : 'Boa noite,';
  });
  readonly motivacao = computed(() => {
    const { percentual } = this.resumo();
    if (!this.habitoServ.habitos().length) return 'Crie seu primeiro hábito no botão + e comece sua sequência hoje!';
    if (percentual === 100) return 'Dia perfeito! Todos os hábitos concluídos. 🎉';
    if (percentual >= 50) return 'Você está mandando muito bem! Continue assim para manter a sequência.';
    return 'Bora começar? Cada check-in conta para a sua sequência.';
  });

  // Anel de progresso: circunferência de r=32.
  readonly circunferencia = 2 * Math.PI * 32;
  readonly offsetAnel = computed(() => this.circunferencia * (1 - this.resumo().percentual / 100));
}
