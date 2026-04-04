import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import {
  CadastroParametrosService,
  CadastroParametros
} from 'src/app/services/cadastro-parametros.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cadastro-parametros',
  templateUrl: './cadastro-parametros.component.html',
  imports: [IonicModule, FormsModule, CommonModule],
  styleUrls: ['./cadastro-parametros.component.scss'],
})
export class CadastroParametrosComponent implements OnInit {

  laticinio: string | null = null;
  mesReferencia: string | null = null;
  precoLitro: string = '0.00';
  producaoLitros = '';
  ccs = '';
  cbt = '';
  gordura: string = '0.00';
  proteina: string = '0.00';

  mesesJaCadastrados: string[] = [];
  mensagemMesDuplicado = '';

  mesesDisponiveis = [
    { nome: 'Janeiro',   valor: '0'  },
    { nome: 'Fevereiro', valor: '1'  },
    { nome: 'Março',     valor: '2'  },
    { nome: 'Abril',     valor: '3'  },
    { nome: 'Maio',      valor: '4'  },
    { nome: 'Junho',     valor: '5'  },
    { nome: 'Julho',     valor: '6'  },
    { nome: 'Agosto',    valor: '7'  },
    { nome: 'Setembro',  valor: '8'  },
    { nome: 'Outubro',   valor: '9' },
    { nome: 'Novembro',  valor: '10' },
    { nome: 'Dezembro',  valor: '11' },
  ];

  laticinios: string[] = [
    'CCPR', 'Italac', 'Itambé', 'Piracanjuba',
    'JL', 'Marajoara', 'Nestlé'
  ];

  constructor(
    private router: Router,
    private cadastroService: CadastroParametrosService,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais() {
    const user = this.authService.getUser();
    const meuId = user?.id;

    this.cadastroService.getMeus().subscribe({
      next: (res) => {
        // Filtra no frontend garantindo que só pega registros do usuário logado
        const meusDados = res.rows.filter((p: any) => p.contaId === meuId);

        this.mesesJaCadastrados = meusDados.map((p: any) => String(p.mesReferencia));

        // Pré-seleciona laticínio do último registro do próprio usuário
        if (meusDados.length > 0) {
          const ordenados = [...meusDados].sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          const ultimoLaticinio = ordenados[0].laticinio;
          setTimeout(() => { this.laticinio = ultimoLaticinio; }, 300);
        }
      },
      error: (err) => {
        this.mesesJaCadastrados = [];
      }
    });
  }

  onMesChange() {
    if (this.mesReferencia && this.mesesJaCadastrados.includes(String(this.mesReferencia))) {
      const nomeMes = this.mesesDisponiveis.find(m => m.valor === this.mesReferencia)?.nome;
      this.mensagemMesDuplicado = `Você já cadastrou parâmetros para ${nomeMes}. Escolha outro mês.`;
    } else {
      this.mensagemMesDuplicado = '';
    }
  }

  mesDuplicado(): boolean {
    return !!this.mesReferencia && this.mesesJaCadastrados.includes(String(this.mesReferencia));
  }

  async cadastrarParametros() {
    if (!this.todosCamposPreenchidos()) {
      await this.mostrarToast('Preencha todos os campos obrigatórios.', 'danger');
      return;
    }

    if (this.mesDuplicado()) {
      await this.mostrarToast('Este mês já foi cadastrado.', 'danger');
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
      await this.cadastroService.create(dadosParametros).toPromise();
      this.limparFormulario();
      await this.mostrarToast('Cadastro realizado com sucesso!', 'success');
      this.router.navigate(['/data-parametros']);
    } catch (err: any) {
      await this.mostrarToast(
        'Erro ao cadastrar: ' + (err?.message || 'Erro desconhecido'),
        'danger'
      );
    }
  }

  formatarMoeda(event: any, campo: 'precoLitro' | 'gordura' | 'proteina') {
    const input = event.target;
    let somenteNumeros = input.value.replace(/\D/g, '');

    if (!somenteNumeros) {
      this[campo] = '0.00';
      input.value = '0.00';
      return;
    }

    somenteNumeros = somenteNumeros.replace(/^0+/, '');
    if (!somenteNumeros) {
      this[campo] = '0.00';
      input.value = '0.00';
      return;
    }

    somenteNumeros = somenteNumeros.substring(0, 9);
    const valorFinal = (parseInt(somenteNumeros, 10) / 100).toFixed(2);
    this[campo] = valorFinal;
    input.value = valorFinal;
  }

  valorValido(valor: any): boolean {
    const numero = Number(valor);
    return !isNaN(numero) && numero > 0;
  }

  todosCamposPreenchidos(): boolean {
    if (!this.laticinio || !this.mesReferencia) return false;
    if (!this.valorValido(this.precoLitro))     return false;
    if (!this.valorValido(this.gordura))         return false;
    if (!this.valorValido(this.proteina))        return false;
    if (!this.valorValido(this.producaoLitros))  return false;
    if (!this.valorValido(this.ccs))             return false;
    if (!this.valorValido(this.cbt))             return false;
    return true;
  }

  limparFormulario() {
    this.mesReferencia        = null;
    this.precoLitro           = '0.00';
    this.producaoLitros       = '';
    this.ccs                  = '';
    this.cbt                  = '';
    this.gordura              = '0.00';
    this.proteina             = '0.00';
    this.mensagemMesDuplicado = '';
  }

  async mostrarToast(mensagem: string, cor: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2500,
      color: cor,
      position: 'top',
    });
    await toast.present();
  }

  removerFoco(event: any) {
    (event.target as HTMLElement).blur();
  }
}
