import { Injectable, inject, signal } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { IUsuario } from '../../models/habito.model';

initializeApp(environment.firebase);

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(Storage);
  private pronto?: Promise<Storage>;
  readonly usuario = signal<IUsuario | null>(null);

  /** Cria o banco uma única vez e restaura a sessão salva. */
  iniciar(): Promise<Storage> {
    this.pronto ??= this.storage.create().then(async db => {
      const email: string | null = await db.get('sessao');
      const usuarios = await this.usuarios(db);
      this.usuario.set(usuarios.find(u => u.email === email) ?? null);
      return db;
    });
    return this.pronto;
  }

  async cadastrar(nome: string, email: string, senha: string): Promise<void> {
    const db = await this.iniciar();
    email = email.trim().toLowerCase();
    if (!nome.trim() || !/^\S+@\S+\.\S+$/.test(email) || senha.length < 6) {
      throw new Error('Informe nome, um email válido e uma senha com pelo menos 6 caracteres.');
    }
    const usuarios = await this.usuarios(db);
    if (usuarios.some(u => u.email === email)) throw new Error('Já existe uma conta com esse email.');
    const usuario = { nome: nome.trim(), email, senhaHash: await this.hash(senha) };
    await db.set('usuarios', [...usuarios, usuario]);
    await this.abrirSessao(db, usuario);
  }

  async entrar(email: string, senha: string): Promise<void> {
    const db = await this.iniciar();
    const hash = await this.hash(senha);
    const usuario = (await this.usuarios(db)).find(u => u.email === email.trim().toLowerCase() && u.senhaHash === hash);
    if (!usuario) throw new Error('Email ou senha incorretos.');
    await this.abrirSessao(db, usuario);
  }

  /** Serve tanto para login quanto para cadastro: cria a conta local na primeira vez. */
  async entrarComGoogle(): Promise<void> {
    const db = await this.iniciar();
    const { user } = await FirebaseAuthentication.signInWithGoogle();
    const email = user?.email?.trim().toLowerCase();
    if (!email) throw new Error('Não foi possível obter o email da conta Google.');
    const usuarios = await this.usuarios(db);
    let usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
      usuario = { nome: user?.displayName ?? email.split('@')[0], email, senhaHash: '' };
      await db.set('usuarios', [...usuarios, usuario]);
    }
    await this.abrirSessao(db, usuario);
  }

  async atualizarNome(nome: string): Promise<void> {
    const db = await this.iniciar();
    const atual = this.usuario();
    if (!atual || !nome.trim()) return;
    const usuario = { ...atual, nome: nome.trim() };
    const usuarios = (await this.usuarios(db)).map(u => u.email === usuario.email ? usuario : u);
    await db.set('usuarios', usuarios);
    this.usuario.set(usuario);
  }

  async sair(): Promise<void> {
    const db = await this.iniciar();
    await db.remove('sessao');
    await FirebaseAuthentication.signOut().catch(() => undefined);
    this.usuario.set(null);
  }

  private async abrirSessao(db: Storage, usuario: IUsuario): Promise<void> {
    await db.set('sessao', usuario.email);
    this.usuario.set(usuario);
  }

  private async usuarios(db: Storage): Promise<IUsuario[]> {
    return (await db.get('usuarios')) ?? [];
  }

  // Os dados ficam só no aparelho; o hash evita guardar a senha em texto puro.
  private async hash(senha: string): Promise<string> {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(senha));
    return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
  }
}
