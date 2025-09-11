import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { RegistroService } from 'src/app/services/registro.service';

@Component({
  selector: 'app-cadastro-parametros',
  templateUrl: './cadastro-parametros.component.html',
  imports: [IonicModule, FormsModule],
  styleUrls: ['./cadastro-parametros.component.scss'],
})
export class CadastroParametrosComponent {
  mesReferencia = '';
  precoLitro = '';
  producaoLitros = '';
  ccs = '';
  cbt = '';
  gordura = '';
  proteina = '';

  constructor(
    private router: Router,
    private registroService: RegistroService,
    private toastController: ToastController
  ) {}

  async cadastrarParametros() {
    if (!this.todosCamposPreenchidos()) {
      this.mostrarToast('Preencha todos os campos obrigatórios.', 'danger');
      return;
    }

    const dadosParametros = {
      mesReferencia: this.mesReferencia,
      precoLitro: this.precoLitro,
      producaoLitros: this.producaoLitros,
      ccs: this.ccs,
      cbt: this.cbt,
      gordura: this.gordura,
      proteina: this.proteina,
    };

    console.log('Dados cadastrados:', dadosParametros);
     this.router.navigate(['/home']); // opcional

    // Chamada do serviço (descomente quando estiver implementado)
    /*
    this.registroService.cadastrar(dadosParametros).subscribe({
      next: async () => {
        this.limparFormulario();
        await this.mostrarToast('Cadastro realizado com sucesso!', 'success');
        this.router.navigate(['/home']); // opcional
      },
      error: async (err) => {
        await this.mostrarToast('Erro ao cadastrar: ' + err.message, 'danger');
      }
    });
    */

    // Para teste local, sem backend:
    this.limparFormulario();
    await this.mostrarToast('Cadastro realizado com sucesso!', 'success');
  }

  todosCamposPreenchidos(): boolean {
    const campos = [
      this.mesReferencia,
      this.precoLitro,
      this.producaoLitros,
      this.ccs,
      this.cbt,
      this.gordura,
      this.proteina
    ];
    return campos.every(campo => campo && campo.trim() !== '');
  }

  limparFormulario() {
    this.mesReferencia = '';
    this.precoLitro = '';
    this.producaoLitros = '';
    this.ccs = '';
    this.cbt = '';
    this.gordura = '';
    this.proteina = '';
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
