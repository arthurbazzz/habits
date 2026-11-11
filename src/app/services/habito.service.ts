import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  addDoc, collection, deleteDoc, deleteField, doc, getFirestore, onSnapshot, query, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { IHabito, createIHabito } from '../../models/habito.model';
import { AuthService } from './auth.service';
import { chaveDia, somarDias } from './datas';

export type StatusHoje = 'concluido' | 'andamento' | 'pendente';

@Injectable({ providedIn: 'root' })
export class HabitoService {
  private readonly auth = inject(AuthService);
  private readonly firestore = getFirestore();
  private readonly colecao = collection(this.firestore, 'habitos');
  readonly habitos = signal<IHabito[]>([]);

  readonly resumoHoje = computed(() => {
    const status = this.habitos().map(h => this.status(h));
    const concluidos = status.filter(s => s === 'concluido').length;
    return {
      concluidos,
      andamento: status.filter(s => s === 'andamento').length,
      pendentes: status.filter(s => s === 'pendente').length,
      percentual: status.length ? Math.round((concluidos / status.length) * 100) : 0,
    };
  });

  readonly sequenciaAtual = computed(() => Math.max(0, ...this.habitos().map(h => this.sequencia(h))));
  readonly melhorSequenciaGeral = computed(() => Math.max(0, ...this.habitos().map(h => this.melhorSequencia(h))));
  readonly totalCheckins = computed(() => this.habitos().reduce((total, h) => total + this.totalDias(h), 0));

  constructor() {
    // Escuta os hábitos do usuário logado no Firestore; troca a assinatura quando ele muda.
    effect(onCleanup => {
      const email = this.auth.usuario()?.email;
      this.habitos.set([]);
      if (!email) return;
      const cancelar = onSnapshot(query(this.colecao, where('usuario', '==', email)), snap => {
        this.habitos.set(snap.docs.map(d => ({ ...d.data(), id: d.id }) as IHabito));
      }, erro => console.error('Erro ao ler hábitos do Firestore', erro));
      onCleanup(cancelar);
    });
  }

  get(id: string): IHabito | undefined {
    return this.habitos().find(h => h.id === id);
  }

  async add(dados: IHabito): Promise<IHabito> {
    if (!dados.nome.trim()) throw new Error('Dê um nome para o hábito.');
    const { id: _, ...habito }: IHabito = {
      ...createIHabito(), ...dados, nome: dados.nome.trim(), unidade: dados.unidade.trim() || 'vez',
      meta: Math.max(1, Math.round(dados.meta)), usuario: this.email(), criadoEm: chaveDia(), checkins: {},
    };
    const docRef = await addDoc(this.colecao, habito);
    return { ...habito, id: docRef.id };
  }

  async update(habito: IHabito): Promise<void> {
    const { id, ...dados } = habito;
    await setDoc(doc(this.firestore, 'habitos', id), { ...dados, usuario: this.email() });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'habitos', id));
  }

  /** Soma uma unidade ao progresso de hoje; ao bater a meta, o próximo toque zera o dia. */
  async checkin(id: string): Promise<void> {
    const habito = this.get(id);
    if (!habito) return;
    const hoje = chaveDia();
    const atual = habito.checkins[hoje] ?? 0;
    const proximo = atual >= habito.meta ? 0 : atual + 1;
    // Atualiza só o dia de hoje dentro do map de checkins.
    await updateDoc(doc(this.firestore, 'habitos', id), { [`checkins.${hoje}`]: proximo || deleteField() });
  }

  async alterarMeta(id: string, delta: number): Promise<void> {
    const habito = this.get(id);
    if (habito) await updateDoc(doc(this.firestore, 'habitos', id), { meta: Math.max(1, habito.meta + delta) });
  }

  progresso(habito: IHabito, dia = new Date()): number {
    return habito.checkins[chaveDia(dia)] ?? 0;
  }

  concluido(habito: IHabito, dia = new Date()): boolean {
    return this.progresso(habito, dia) >= habito.meta;
  }

  status(habito: IHabito): StatusHoje {
    const feito = this.progresso(habito);
    return feito >= habito.meta ? 'concluido' : feito > 0 ? 'andamento' : 'pendente';
  }

  /** Dias seguidos concluídos até hoje (ou até ontem, se hoje ainda não foi feito). */
  sequencia(habito: IHabito): number {
    let dia = new Date();
    if (!this.concluido(habito, dia)) dia = somarDias(dia, -1);
    let total = 0;
    while (this.concluido(habito, dia)) {
      total++;
      dia = somarDias(dia, -1);
    }
    return total;
  }

  melhorSequencia(habito: IHabito): number {
    const dias = Object.keys(habito.checkins).filter(k => habito.checkins[k] >= habito.meta).sort();
    let melhor = 0, atual = 0, anterior = '';
    for (const dia of dias) {
      const [a, m, d] = dia.split('-').map(Number);
      atual = anterior === chaveDia(somarDias(new Date(a, m - 1, d), -1)) ? atual + 1 : 1;
      melhor = Math.max(melhor, atual);
      anterior = dia;
    }
    return melhor;
  }

  totalDias(habito: IHabito): number {
    return Object.values(habito.checkins).filter(v => v >= habito.meta).length;
  }

  dias(qtd: number): string {
    return `${qtd} ${qtd === 1 ? 'dia' : 'dias'}`;
  }

  descricaoMeta(habito: IHabito): string {
    return `${habito.meta} ${habito.unidade}`;
  }

  exportar(): string {
    return JSON.stringify({ usuario: this.auth.usuario()?.nome, habitos: this.habitos() }, null, 2);
  }

  private email(): string {
    const email = this.auth.usuario()?.email;
    if (!email) throw new Error('Faça login para salvar seus hábitos.');
    return email;
  }
}
