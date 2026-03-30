import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CadastroContaService } from '../../services/cadastro-conta.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-cadastro-conta',
  templateUrl: './cadastro-conta.component.html',
  imports: [IonicModule, FormsModule, CommonModule],
  styleUrls: ['./cadastro-conta.component.scss'],
})
export class CadastroContaComponent {
  name = '';
  email = '';
  password = '';
  erro = '';
  sucesso = '';
  carregando = false;

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController, ) {}

  async cadastrarConta() {
    this.erro = '';
    this.sucesso = '';

    if (!this.name || !this.email || !this.password) {
      await this.mostrarToast('Preencha todos os campos.', 'danger');
      return;
    }

    this.carregando = true;

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.carregando = false;
        this.sucesso = 'Conta criada com sucesso!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 409 || err.error?.message?.includes('duplicate')) {
          this.erro = 'Este e-mail já está cadastrado';
        } else if (err.status === 401) {
          this.erro = 'Acesso não autorizado';
        } else {
          this.erro = 'Erro ao criar conta. Tente novamente.';
        }
      }
    });
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  async mostrarToast(mensagem: string, cor: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor,
      position: 'top',
    });
    await toast.present();
  }
}
