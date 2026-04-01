import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MeusDadosService, MeusDadosCadastrais, MeuParametro } from 'src/app/services/meus-dados.service';

@Component({
  selector: 'app-meus-dados',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './meus-dados.component.html',
  styleUrls: ['./meus-dados.component.scss']
})
export class MeusDadosComponent implements OnInit {

  dados: MeusDadosCadastrais | null = null;
  carregando = true;
  erro: string | null = null;

  // Seletores
  anoSelecionado: number = new Date().getFullYear();
  mesSelecionado: number | null = null;

  anosDisponiveis: number[] = [];
  mesesComRegistro: { valor: number; nome: string }[] = [];

  private mesesNomes = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  private laticinioIcons: Record<string, string> = {
    'JL':          'assets/icon/valeza.png',
    'CCPR':        'assets/icon/ccpr.png',
    'Piracanjuba': 'assets/icon/piracanjuba.png',
    'ITALAC':      'assets/icon/italac.png',
    'Nestle':      'assets/icon/nestle.jpg',
    'Marajoara':   'assets/icon/marajoara.jpg',
  };

  constructor(private meusDadosService: MeusDadosService) {}

  ngOnInit(): void {
    this.meusDadosService.getMeusDados().subscribe({
      next: (res) => {
        this.dados = res;
        this.inicializarFiltros(res.parametros);
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar seus dados. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  private inicializarFiltros(parametros: MeuParametro[]): void {
    // Anos disponíveis
    const anos = [...new Set(parametros.map(p => new Date(p.createdAt).getFullYear()))]
      .sort((a, b) => a - b);
    this.anosDisponiveis = anos;

    // Se o ano atual não tiver registros, usa o mais recente disponível
    if (!anos.includes(this.anoSelecionado) && anos.length > 0) {
      this.anoSelecionado = anos[anos.length - 1];
    }

    this.atualizarMeses();
  }

  /** Recalcula meses disponíveis para o ano selecionado e define o último */
  atualizarMeses(): void {
    if (!this.dados) return;

    const parametrosDoAno = this.dados.parametros.filter(
      p => new Date(p.createdAt).getFullYear() === this.anoSelecionado
    );

    const mesesUnicos = [...new Set(parametrosDoAno.map(p => Number(p.mesReferencia)))]
      .sort((a, b) => a - b);

    this.mesesComRegistro = mesesUnicos.map(m => ({
      valor: m,
      nome: this.mesesNomes[m] ?? `Mês ${m}`
    }));

    // Seleciona o último mês do ano escolhido
    this.mesSelecionado = mesesUnicos.length > 0
      ? mesesUnicos[mesesUnicos.length - 1]
      : null;
  }

  /** Registros filtrados por ano + mês */
  get parametrosFiltrados(): MeuParametro[] {
    if (!this.dados) return [];

    return this.dados.parametros.filter(p => {
      const anoParam = new Date(p.createdAt).getFullYear();
      const mesParam = Number(p.mesReferencia);
      return anoParam === this.anoSelecionado && mesParam === this.mesSelecionado;
    });
  }

  nomeMes(mes: string | number): string {
    return this.mesesNomes[Number(mes)] ?? 'Desconhecido';
  }

  iconLaticinio(laticinio: string): string {
    return this.laticinioIcons[laticinio] ?? 'assets/icon/default.svg';
  }
}
