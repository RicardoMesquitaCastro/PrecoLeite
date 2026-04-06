import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { MeusDadosService, MeusDadosCadastrais, MeuParametro } from 'src/app/services/meus-dados.service';

Chart.register(...registerables);

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

  @ViewChild('graficoParametros') graficoRef!: ElementRef<HTMLCanvasElement>;
  private grafico: Chart | null = null;

  // ── Tabs do gráfico ──────────────────────────────────
  chartTabs: { key: string; label: string; unidade: string; cor: string; campo: keyof MeuParametro }[] = [
    { key: 'precoLeite',     label: 'Preço',    unidade: 'R$/L',   cor: '#0B5A68', campo: 'precoLeite'     },
    { key: 'producaoLitros', label: 'Produção', unidade: 'Litros', cor: '#FF7400', campo: 'producaoLitros' },
    { key: 'ccs',            label: 'CCS',      unidade: 'x1000',  cor: '#E00809', campo: 'ccs'            },
    { key: 'cbt',            label: 'CBT',      unidade: 'x1000',  cor: '#9966FF', campo: 'cbt'            },
    { key: 'gordura',        label: 'Gordura',  unidade: '%',      cor: '#FF9F40', campo: 'gordura'        },
    { key: 'proteina',       label: 'Proteína', unidade: '%',      cor: '#4BC0C0', campo: 'proteina'       },
  ];

  tabAtiva: string = 'precoLeite';

  get tabAtual() {
    return this.chartTabs.find(t => t.key === this.tabAtiva) ?? null;
  }

  mudarTab(key: string): void {
    this.tabAtiva = key;
    setTimeout(() => this.montarGrafico());
  }

  constructor(private meusDadosService: MeusDadosService) {}

  ngOnInit(): void {
    this.meusDadosService.getMeusDados().subscribe({
      next: (res) => {
        this.dados = res;
        this.inicializarFiltros(res.parametros);
        this.carregando = false;
        setTimeout(() => this.montarGrafico());
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
  /** Monta o gráfico de linha para o parâmetro da tab ativa, agrupado por mês */
  montarGrafico(): void {
    if (!this.graficoRef?.nativeElement || !this.dados) return;

    const tab = this.tabAtual;
    if (!tab) return;

    // Agrupa por mês: para cada mês pega a média do campo selecionado
    const parametrosDoAno = this.dados.parametros.filter(
      p => new Date(p.createdAt).getFullYear() === this.anoSelecionado
    );

    // Todos os meses presentes no ano
    const mesesUnicos = [...new Set(parametrosDoAno.map(p => Number(p.mesReferencia)))].sort((a, b) => a - b);

    const labels = mesesUnicos.map(m => this.mesesNomes[m] ?? `Mês ${m}`);

    const data = mesesUnicos.map(mes => {
      const registros = parametrosDoAno.filter(p => Number(p.mesReferencia) === mes);
      const soma = registros.reduce((acc, p) => acc + Number(p[tab.campo] ?? 0), 0);
      return registros.length > 0 ? +(soma / registros.length).toFixed(3) : null;
    });

    if (this.grafico) this.grafico.destroy();

    this.grafico = new Chart(this.graficoRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${tab.label} (${tab.unidade})`,
          data,
          borderColor: tab.cor,
          backgroundColor: tab.cor + '22',
          pointBackgroundColor: tab.cor,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.3,
          spanGaps: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${tab.label}: ${ctx.raw} ${tab.unidade}`
            }
          }
        },
        scales: {
          x: {
            ticks: { autoSkip: false, font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: {
            beginAtZero: false,
            ticks: { font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });
  }

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

    setTimeout(() => this.montarGrafico());
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
