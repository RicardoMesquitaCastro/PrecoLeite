import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import {
  CadastroParametrosService,
  CadastroParametros
} from 'src/app/services/cadastro-parametros.service';

@Component({
  selector: 'app-cadastro-parametros',
  templateUrl: './cadastro-parametros.component.html',
  imports: [IonicModule, FormsModule],
  styleUrls: ['./cadastro-parametros.component.scss'],
})
export class CadastroParametrosComponent {

  // 🔹 Laticínio agora vem de um ion-select
  laticinio: string | null = null;

  mesReferencia = '';
  precoLitro = '';
  producaoLitros = '';
  ccs = '';
  cbt = '';
  gordura = '';
  proteina = '';

  // 🔹 Lista de opções do select
  laticinios: string[] = [
    'CCPR',
    'Italac',
    'Itambé',
    'Piracanjuba',
    'Valeza',
    'Marajoara',
    'Nestlé'
  ];

  constructor(
    private router: Router,
    private cadastroService: CadastroParametrosService,
    private toastController: ToastController
  ) {}

  async cadastrarParametros() {
    if (!this.todosCamposPreenchidos()) {
      await this.mostrarToast('Preencha todos os campos obrigatórios.', 'danger');
      return;
    }

    const dadosParametros: CadastroParametros = {
      laticinio: this.laticinio!,
      mesReferencia: this.mesReferencia,
      precoLeite: parseFloat(this.precoLitro),
      producaoLitros: parseFloat(this.producaoLitros),
      ccs: parseFloat(this.ccs),
      cbt: parseFloat(this.cbt),
      gordura: parseFloat(this.gordura),
      proteina: parseFloat(this.proteina),
    };

    try {
      const resposta = await this.cadastroService.create(dadosParametros).toPromise();
      console.log('Dados cadastrados:', resposta);

      this.limparFormulario();
      await this.mostrarToast('Cadastro realizado com sucesso!', 'success');
      this.router.navigate(['/home']);

    } catch (err: any) {
      await this.mostrarToast(
        'Erro ao cadastrar: ' + (err?.message || 'Erro desconhecido'),
        'danger'
      );
    }
  }

  todosCamposPreenchidos(): boolean {
    const campos = [
      this.laticinio,
      this.mesReferencia,
      this.precoLitro,
      this.producaoLitros,
      this.ccs,
      this.cbt,
      this.gordura,
      this.proteina
    ];

    return campos.every(campo => campo !== null && campo.toString().trim() !== '');
  }

  limparFormulario() {
    this.laticinio = null;
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
