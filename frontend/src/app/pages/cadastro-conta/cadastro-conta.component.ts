import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router, private toastController: ToastController) {}

  async cadastrarConta() {
    if (!this.name || !this.email || !this.password) {
      await this.mostrarToast('Preencha todos os campos.', 'danger');
      return;
    }

    const dados = {
      nome: this.name,
      email: this.email,
      senha: this.password,
    };

    console.log('Dados cadastrados:', dados);

    // Chamada do serviço (comentada por enquanto)
    /*
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: async (res) => {
        this.auth.saveToken(res.token); // apenas se seu serviço tiver isso
        await this.mostrarToast('Cadastro realizado com sucesso!', 'success');
        this.router.navigate(['/cadastro-propriedade']);
      },
      error: async () => {
        await this.mostrarToast('Erro ao cadastrar', 'danger');
      }
    });
    */

    // Para teste local sem backend:
    this.limparFormulario();
    await this.mostrarToast('Cadastro realizado com sucesso!', 'success');
    this.router.navigate(['/cadastro-propriedade']);
  }

  limparFormulario() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.erro = '';
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
