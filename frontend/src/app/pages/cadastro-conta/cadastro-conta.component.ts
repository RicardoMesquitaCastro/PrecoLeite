import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cadastro-conta',
  templateUrl: './cadastro-conta.component.html',
  imports: [IonicModule, FormsModule, CommonModule],
  styleUrls: ['./cadastro-conta.component.scss'],
})
export class CadastroContaComponent {
  name      = '';
  email     = '';
  password  = '';
  tipoConta: 'produtor' | 'visitante' | '' = '';
  erro      = '';
  sucesso   = '';
  carregando = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
  ) {}

  async cadastrarConta() {
    this.erro    = '';
    this.sucesso = '';

    if (!this.name || !this.email || !this.password || !this.tipoConta) {
      await this.mostrarToast('Preencha todos os campos.', 'danger');
      return;
    }

    this.carregando = true;

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.authService.login(this.email, this.password).subscribe({
          next: () => {
            // Login OK — agora salva o tipoConta na chave 'role'
            this.authService.saveRole(this.tipoConta);

            this.carregando = false;
            this.sucesso = 'Conta criada com sucesso!';

            const destino = this.tipoConta === 'produtor'
              ? '/cadastro-propriedade'
              : '/home';

            setTimeout(() => this.router.navigate([destino]), 1500);
          },
          error: () => {
            this.carregando = false;
            this.sucesso = 'Conta criada! Faça login para continuar.';
            setTimeout(() => this.router.navigate(['/login']), 1500);
          }
        });
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
