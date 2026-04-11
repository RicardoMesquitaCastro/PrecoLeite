import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  imports: [IonicModule, FormsModule, CommonModule],
  styleUrls: ['./redefinir-senha.component.scss'],
})
export class RedefinirSenhaComponent implements OnInit {
  password = '';
  passwordConfirm = '';
  token = '';
  carregando = false;
  sucesso = false;
  erro = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // O token vem na URL: /redefinir-senha/:token
    this.token = this.route.snapshot.paramMap.get('token') || '';

    if (!this.token) {
      this.erro = 'Link inválido ou expirado.';
    }
  }

  redefinirSenha() {
    this.erro = '';

    if (!this.password || this.password.length < 6) {
      this.erro = 'A senha deve ter no mínimo 6 caracteres';
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.erro = 'As senhas não conferem';
      return;
    }

    this.carregando = true;

    // PUT /password-resets/:token  body: { password }
    this.http.put(
      `${environment.apiUrl}/password-resets/${this.token}`,
      { password: this.password }
    ).subscribe({
      next: () => {
        this.carregando = false;
        this.sucesso = true;
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 404) {
          this.erro = 'Link inválido ou expirado. Solicite um novo.';
        } else {
          this.erro = 'Erro ao redefinir senha. Tente novamente.';
        }
      }
    });
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
