import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.component.html',
  imports: [IonicModule, FormsModule, CommonModule],
  styleUrls: ['./esqueci-senha.component.scss'],
})
export class EsqueciSenhaComponent {
  email = '';
  carregando = false;
  enviado = false;
  erro = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
  ) {}

  enviarEmail() {
    this.erro = '';

    if (!this.email) {
      this.erro = 'Informe seu e-mail';
      return;
    }

    this.carregando = true;

    // O backend espera: { email, link }
    // O link é a URL da tela de redefinição de senha
    const link = `${window.location.origin}/redefinir-senha`;

    this.http.post(
      `${environment.apiUrl}/password-resets?access_token=${environment.MASTER_KEY}`,
      { email: this.email, link }
    ).subscribe({
      next: () => {
        this.carregando = false;
        this.enviado = true;
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 404) {
          this.erro = 'E-mail não encontrado';
        } else {
          this.erro = 'Erro ao enviar e-mail. Tente novamente.';
        }
      }
    });
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
