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
  erro = '';

  constructor(
    private router: Router,
    private registroService: RegistroService,
    private toastController: ToastController  // ✅ injetar o ToastController
  ) {}

  async cadastrarParametros() {
    if (!this.todosCamposPreenchidos()) {
      this.erro = 'Preencha todos os campos obrigatórios.';
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

    // Mostrar dados no console
    console.log('Dados cadastrados:', dadosParametros);

    // Limpar formulário
    this.mesReferencia = '';
    this.precoLitro = '';
    this.producaoLitros = '';
    this.ccs = '';
    this.cbt = '';
    this.gordura = '';
    this.proteina = '';
    this.erro = '';

    // Mostrar toast de sucesso
    const toast = await this.toastController.create({
      message: 'Cadastro realizado com sucesso!',
      duration: 2000,       // duração em ms
      color: 'success',
      position: 'top'
    });
    await toast.present();
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
}
