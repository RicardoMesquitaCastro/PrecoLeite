import { CommonModule } from '@angular/common';
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
  imports: [IonicModule, FormsModule, CommonModule],
  styleUrls: ['./cadastro-parametros.component.scss'],
})
export class CadastroParametrosComponent {

  // 🔹 Laticínio agora vem de um ion-select
  laticinio: string | null = null;

  mesesDisponiveis = [
    { nome: 'Janeiro', valor: '1' },
    { nome: 'Fevereiro', valor: '2' },
    { nome: 'Março', valor: '3' },
    { nome: 'Abril', valor: '4' },
    { nome: 'Maio', valor: '5' },
    { nome: 'Junho', valor: '6' },
    { nome: 'Julho', valor: '7' },
    { nome: 'Agosto', valor: '8' },
    { nome: 'Setembro', valor: '9' },
    { nome: 'Outubro', valor: '10' },
    { nome: 'Novembro', valor: '11' },
    { nome: 'Dezembro', valor: '12' },
  ];
  precoLitro: string = '0.00';
  producaoLitros = '';
  ccs = '';
  cbt = '';
  gordura: string = '0.00';
proteina: string = '0.00';

  mesReferencia: string | null = null;

  // 🔹 Lista de opções do select
  laticinios: string[] = [
    'CCPR',
    'Italac',
    'Itambé',
    'Piracanjuba',
    'JL',
    'Marajoara',
    'Nestlé'
  ];

  constructor(
    private router: Router,
    private cadastroService: CadastroParametrosService,
    private toastController: ToastController
  ) { }

  async cadastrarParametros() {
    if (!this.todosCamposPreenchidos()) {
      await this.mostrarToast('Preencha todos os campos obrigatórios.', 'danger');
      return;
    }

    const dadosParametros: CadastroParametros = {
      laticinio: this.laticinio!,
      mesReferencia: String(this.mesReferencia),
      precoLeite: parseFloat(this.precoLitro),
      producaoLitros: parseFloat(this.producaoLitros),
      ccs: parseFloat(this.ccs),
      cbt: parseFloat(this.cbt),
      gordura: parseFloat(this.gordura),
      proteina: parseFloat(this.proteina),
    };

    try {
      const resposta = await this.cadastroService.create(dadosParametros).toPromise();

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

 formatarMoeda(event: any, campo: 'precoLitro' | 'gordura' | 'proteina') {

  let input = event.target;

  // Remove tudo que não for número
  let valor = input.value.replace(/\D/g, '');

  if (!valor) {
    this[campo] = '0.00';
    input.value = '0.00';
    return;
  }

  // Limita tamanho (opcional — evita números absurdos)
  valor = valor.substring(0, 9);

  const numeroFormatado = (parseInt(valor, 10) / 100).toFixed(2);

  this[campo] = numeroFormatado;
  input.value = numeroFormatado;
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

  return campos.every(campo => {
    if (campo === null) return false;

    const valor = campo.toString().trim();

    if (valor === '') return false;

    // bloqueia 0.00
    if (valor === '0.00') return false;

    return true;
  });
}

  limparFormulario() {
    this.laticinio = null;
    mesReferencia: this.mesReferencia,
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

  removerFoco(event: any) {
    (event.target as HTMLElement).blur();
  }
}
