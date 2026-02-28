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

  const input = event.target;

  // Remove tudo que não for número
  let somenteNumeros = input.value.replace(/\D/g, '');

  // Se vazio → volta para 0
  if (!somenteNumeros) {
    this[campo] = '0.00';
    input.value = '0.00';
    return;
  }

  // Remove zeros excessivos à esquerda
  somenteNumeros = somenteNumeros.replace(/^0+/, '');

  if (!somenteNumeros) {
    this[campo] = '0.00';
    input.value = '0.00';
    return;
  }

  // Limite de tamanho (evita números absurdos)
  somenteNumeros = somenteNumeros.substring(0, 9);

  const valorFinal = (parseInt(somenteNumeros, 10) / 100).toFixed(2);

  this[campo] = valorFinal;
  input.value = valorFinal;
}

valorValido(valor: any): boolean {
  if (!valor) return false;

  const numero = Number(valor);

  return !isNaN(numero) && numero > 0;
}



 todosCamposPreenchidos(): boolean {

  if (!this.laticinio || !this.mesReferencia) return false;

  if (!this.valorValido(this.precoLitro)) return false;
  if (!this.valorValido(this.gordura)) return false;
  if (!this.valorValido(this.proteina)) return false;
  if (!this.valorValido(this.producaoLitros)) return false;
  if (!this.valorValido(this.ccs)) return false;
  if (!this.valorValido(this.cbt)) return false;

  return true;
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
