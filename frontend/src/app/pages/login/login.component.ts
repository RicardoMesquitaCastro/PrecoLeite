import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [IonicModule, FormsModule, RouterModule],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  usuario = '';
  senha = '';
  erro = '';
  carregando = false;

  constructor(private router: Router, private authService: AuthService) {}

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

  irParaCadastro() {
    this.router.navigate(['/cadastro-conta']);
  }
}
