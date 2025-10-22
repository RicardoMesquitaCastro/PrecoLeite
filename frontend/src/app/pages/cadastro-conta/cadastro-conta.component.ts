import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CadastroContaService } from '../../services/cadastro-conta.service';

@Component({
  selector: 'app-cadastro-conta',
  templateUrl: './cadastro-conta.component.html',
  imports: [IonicModule, FormsModule, CommonModule],
  styleUrls: ['./cadastro-conta.component.scss'],
})
export class CadastroContaComponent implements OnInit{
  name = '';
  email = '';
  password = '';
  erro = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private cadastroContaService: CadastroContaService
  ) {}

  ngOnInit(): void {
     this.cadastroContaService.getAll().subscribe({


    });
  }

  async cadastrarConta() {
    if (!this.name || !this.email || !this.password) {
      await this.mostrarToast('Preencha todos os campos.', 'danger');
      return;
    }

    const conta = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.cadastroContaService.create(conta).subscribe({
      next: async () => {
        await this.mostrarToast('Cadastro realizado com sucesso!', 'success');
        this.limparFormulario();
        this.router.navigate(['/cadastro-propriedade']);
      },
      error: async (err) => {
        console.error('Erro ao cadastrar conta:', err);
        await this.mostrarToast('Erro ao cadastrar conta.', 'danger');
      }
    });
  }

  get() {



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
