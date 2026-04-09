import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [IonicModule, FormsModule, RouterModule],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  usuario = '';
  senha = '';
  erro = '';
  carregando = false;
  carregandoGoogle = false;

  private readonly GOOGLE_CLIENT_ID = '705490533967-6m43gdlp6fgv7agsr5aulngmda3dq3n5.apps.googleusercontent.com';

  // URL de redirect após o popup Google fechar — deve ser a própria página de login
  private readonly REDIRECT_URI = window.location.origin + '/login';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  // ─── VERIFICA SE VOLTOU DO POPUP GOOGLE ──────────────────────────────────
  // O popup redireciona de volta para /login?code=XXX — capturamos o code aqui
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        // Limpa a URL sem recarregar a página
        window.history.replaceState({}, '', '/login');
        this.carregandoGoogle = true;
        this.trocarCodePorToken(code);
      }
    });
  }

  // ─── LOGIN EMAIL / SENHA ──────────────────────────────────────────────────
  login() {
    this.erro = '';

    if (!this.usuario || !this.senha) {
      this.erro = 'Preencha e-mail e senha';
      return;
    }

    this.carregando = true;

    this.authService.login(this.usuario, this.senha).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 401) {
          this.erro = 'Usuário ou senha inválidos';
        } else {
          this.erro = 'Erro ao conectar com o servidor';
        }
      }
    });
  }

  // ─── LOGIN GOOGLE (OAuth2 popup) ──────────────────────────────────────────
  // Usa google.accounts.oauth2 — mais compatível com localhost que o One Tap
  loginComGoogle() {
    this.erro = '';

    if (typeof google === 'undefined') {
      this.erro = 'Serviço do Google não carregado. Verifique sua conexão.';
      return;
    }

    this.carregandoGoogle = true;

    const client = google.accounts.oauth2.initCodeClient({
      client_id: this.GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      ux_mode: 'popup',
      callback: (response: any) => {
        this.ngZone.run(() => {
          if (response?.code) {
            // Envia o authorization code para o backend trocar por token
            this.trocarCodePorToken(response.code);
          } else {
            this.carregandoGoogle = false;
            if (response?.error !== 'access_denied') {
              this.erro = 'Não foi possível autenticar com Google';
            }
          }
        });
      },
    });

    client.requestCode();
  }

  // Envia o authorization code para o backend
  private trocarCodePorToken(code: string) {
    this.authService.loginComGoogle(code).subscribe({
      next: () => {
        this.carregandoGoogle = false;
        this.ngZone.run(() => this.router.navigate(['/home']));
      },
      error: (err) => {
        this.carregandoGoogle = false;
        if (err.status === 401) {
          this.erro = 'Conta Google não autorizada';
        } else {
          this.erro = 'Erro ao autenticar com Google';
        }
      }
    });
  }

  ngOnDestroy() {}

  // ─── NAVEGAÇÃO ────────────────────────────────────────────────────────────
  irParaCadastro() {
    this.router.navigate(['/cadastro-conta']);
  }
}
