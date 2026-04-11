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
  private readonly REDIRECT_URI = window.location.origin + '/login';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  // ─── VERIFICA SE VOLTOU DO POPUP GOOGLE ──────────────────────────────────
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
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

  // ─── TROCA O CODE PELO TOKEN E DECIDE O DESTINO ──────────────────────────
  // O backend deve retornar { isNewUser: boolean } (ou campo equivalente)
  // para que possamos saber se é o primeiro acesso via Google.
  private trocarCodePorToken(code: string) {
    this.authService.loginComGoogle(code).subscribe({
      next: (res: any) => {
        this.carregandoGoogle = false;

        this.ngZone.run(() => {
          // Se o backend indicar que é um usuário novo, redireciona para
          // cadastro-conta em modo "somente tipo" (sem dados pessoais).
          if (res?.isNewUser) {
            this.router.navigate(['/cadastro-conta'], {
              queryParams: { origem: 'google' }
            });
          } else {
            this.router.navigate(['/home']);
          }
        });
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
  irParaEsqueciSenha() {
  this.router.navigate(['/esqueci-senha']);
}
}
