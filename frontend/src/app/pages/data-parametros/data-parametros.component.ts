import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { FaixaValidaPipe } from './faixa-valida.pipe';

import { DadosService, DadoLeite } from 'src/app/services/dados.service';
import { Router } from '@angular/router';
import { EstatisticasService } from 'src/app/services/estatisticas.service';

Chart.register(...registerables);

@Component({
  selector: 'app-data-parametros',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './data-parametros.component.html',
  styleUrls: ['./data-parametros.component.scss']
})


export class DataParametrosPage implements AfterViewInit  {

  constructor(
  private dadosService: DadosService,
  private router: Router,
  private estatisticasService: EstatisticasService,
) {}
private _graficoRegiaoRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoRegiao')
set graficoRegiaoSetter(ref: ElementRef<HTMLCanvasElement> | undefined) {

  if (!ref) return;

  this._graficoRegiaoRef = ref;

  // Quando o canvas nasce no DOM, cria o gráfico
  if (
    this.agrupamentoSelecionado === 'regiao' &&
    this.municipioSelecionado !== 'geral'
  ) {
    this.montarGraficoRegiao();
  }
}

  private _graficoMesRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoMes')
  set graficoMesSetter(ref: ElementRef<HTMLCanvasElement> | undefined) {
    if (!ref) return;
    this._graficoMesRef = ref;
    if (this.agrupamentoSelecionado === 'mes') {
      this.montarGraficoMes();
    }
  }

  graficoRegiao!: Chart;
  graficoMes!: Chart;
  grafico: Chart | null = null;
  graficoIniciado = false;
  agrupamentoSelecionado: string = 'laticinio';
  tituloGrafico: string = 'Comparativo Intervalos e Preços';
  regiaoSelecionada: string | null = null;
  dadosList: DadoLeite[] = [];
  municipioSelecionado: string | null = "geral";
  municipiosDisponiveis: string[] = [];
  mesSelecionado: string = 'geral';
  currentYear = new Date().getFullYear();
  anoSelecionado: number = 2026; // ano atual
  anosDisponiveis: number[] = [];
  laticinioSelecionado: string = 'todos'
laticiniosDisponiveis: string[] = []

  laticinio: string = '';
  mesReferencia: number | null = null;
  producaoLitros: number | null = null;
  precoLitro: number | null = null;
  ccs: number | null = null;
  cbt: number | null = null;
  gordura: number | null = null;
  proteina: number | null = null;

  mesesDisponiveis = [
    { nome: 'Janeiro', valor: 0 },
    { nome: 'Fevereiro', valor: 1 },
    { nome: 'Março', valor: 2 },
    { nome: 'Abril', valor: 3 },
    { nome: 'Maio', valor: 4 },
    { nome: 'Junho', valor: 5 },
    { nome: 'Julho', valor: 6 },
    { nome: 'Agosto', valor: 7 },
    { nome: 'Setembro', valor: 8 },
    { nome: 'Outubro', valor: 9 },
    { nome: 'Novembro', valor: 10 },
    { nome: 'Dezembro', valor: 11 },
  ];

  laticinioIcons: Record<string, string> = {
    'JL': 'assets/icon/valeza.png',
    'CCPR': 'assets/icon/ccpr.png',
    'Piracanjuba': 'assets/icon/piracanjuba.png',
    'Italac': 'assets/icon/italac.png',
    'Nestle' : 'assets/icon/nestle.jpg',
    'Marajoara' : 'assets/icon/marajoara.jpg',
  };

  faixaMin: number | null = null;
  faixaMax: number | null = null;

  /** Retorna cores corretas para o Chart.js respeitando dark/light mode do sistema */
  private chartColors() {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      title:    dark ? '#f0f0f0' : '#1a2332',
      legend:   dark ? '#d1d5db' : '#374151',
      axis:     dark ? '#9ca3af' : '#6b7280',
      ticks:    dark ? '#d1d5db' : '#4b5563',
      grid:     dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
    };
  }

ionViewDidEnter() {
  requestAnimationFrame(() => {
    this.criarGrafico();
    this.montarGraficoRegiao();
  },);
}

inicializarFiltros() {
  const unicos = new Set(this.dadosList.map(d => d.municipio));
  this.municipiosDisponiveis = Array.from(unicos);

  const anosUnicos = new Set(this.dadosList.map(d => d.anoReferencia));
  this.anosDisponiveis = Array.from(anosUnicos).sort((a, b) => b - a);

  this.laticiniosDisponiveis = [
  ...new Set(this.dadosList.map(d => d.laticinio))
].sort()
}

carregarDados() {
  this.estatisticasService.getDados().subscribe(dados => {
      this.dadosList = dados;
      this.inicializarFiltros();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        this.criarGrafico();
        this.montarGraficoRegiao();
        this.montarGraficoMes();
      }));
    });
}

 ngAfterViewInit() {
  this.carregarDados();
}

  get dadosListFiltrados() {
  return this.dadosList.filter(d =>
    (this.municipioSelecionado === 'geral' || d.municipio === this.municipioSelecionado) &&
    (this.mesReferencia === null || d.mesReferencia === this.mesReferencia) &&
    (this.anoSelecionado === null || d.anoReferencia === this.anoSelecionado) &&
    (this.laticinioSelecionado === 'todos' || d.laticinio === this.laticinioSelecionado)
  );
}

  tentarMontarGrafico() {
    if (this.graficoIniciado) return;
    if (this._graficoRegiaoRef?.nativeElement) {
      this.montarGraficoRegiao();
      this.graficoIniciado = true;
    }
  }

  abrirDetalheLaticinio(laticinio: string) {
  this.router.navigate(['/detalhe-estatistica'], {
    state: {
      tipo:      'laticinio',
      laticinio,
      municipio: this.municipioSelecionado,
      ano:       this.anoSelecionado,
      faixaMin:  this.faixaMin,
      faixaMax:  this.faixaMax,
    },
  });
}

abrirDetalheMes(mesNumero: number, mesNome: string) {
  this.router.navigate(['/detalhe-estatistica'], {
    state: {
      tipo:      'mes',
      mesNumero,
      mesNome,
      municipio: this.municipioSelecionado,
      ano:       this.anoSelecionado,
    },
  });
}

abrirDetalheRegiao(regiao: string) {
  this.router.navigate(['/detalhe-estatistica'], {
    state: {
      tipo:      'regiao',
      regiao,
      municipio: this.municipioSelecionado,
      ano:       this.anoSelecionado,
    },
  });
}

  atualizarTitulo() {
    let partes: string[] = [];

    if (this.faixaMin !== null && this.faixaMax !== null) {
      partes.push(`Faixa: ${this.faixaMin}-${this.faixaMax} L`);
    }

    if (this.municipioSelecionado && this.municipioSelecionado !== 'geral') {
      partes.push(`Município: ${this.municipioSelecionado}`);
    }

    if (this.mesReferencia !== null) {
      const mesNome = this.mesesDisponiveis.find(m => m.valor === this.mesReferencia)?.nome;
      if (mesNome) partes.push(`Mês: ${mesNome}`);
    }

    if (this.anoSelecionado !== null) {
      partes.push(`Ano: ${this.anoSelecionado}`);
    }

    this.tituloGrafico = partes.length > 0
      ? `Comparativo ${partes.join(' - ')}`
      : 'Comparativo Intervalo de Litros';
  }

  montarGraficoRegiao() {

     if (!this._graficoRegiaoRef?.nativeElement) return;

    const dadosFiltrados = this.dadosList.filter(d =>
      (this.municipioSelecionado === 'geral' || d.municipio === this.municipioSelecionado) &&
      (this.mesReferencia === null || d.mesReferencia === Number(this.mesReferencia)) &&
      (this.anoSelecionado === null || d.anoReferencia === this.anoSelecionado)
    );

    const dadosAgrupados = this.agruparPorRegiao(dadosFiltrados);
    dadosAgrupados.sort((a, b) => b.mediaPreco - a.mediaPreco);

    const labels = dadosAgrupados.map(g => g.regiao);
    const valores = dadosAgrupados.map(g => +g.mediaPreco.toFixed(4));

    const canvas = this._graficoRegiaoRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Paleta coerente com a identidade do app
    const CORES = ['#0B5A68', '#0078BD', '#FF7400', '#E00809', '#9966FF', '#FF9F40', '#10b981', '#f59e0b'];

    const makeGrad = (cor: string): CanvasGradient => {
      const g = ctx.createLinearGradient(0, 0, 0, 320);
      g.addColorStop(0, cor + 'DD');
      g.addColorStop(1, cor + '66');
      return g;
    };

    const bgColors   = labels.map((_, i) => makeGrad(CORES[i % CORES.length]));
    const brdColors  = labels.map((_, i) => CORES[i % CORES.length]);

    const mediaGeral = valores.length
      ? valores.reduce((a, b) => a + b, 0) / valores.length
      : 0;

    const yMin = valores.length ? Math.max(0, Math.min(...valores) - 0.2) : 0;
    const yMax = valores.length ? Math.max(...valores) + 0.25 : 5;

    if (this.graficoRegiao) this.graficoRegiao.destroy();

    this.graficoRegiao = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Preço Médio (R$/L)',
            data: valores,
            backgroundColor: bgColors,
            borderColor: brdColors,
            borderWidth: 2,
            borderRadius: 10,
            borderSkipped: false,
            hoverBorderWidth: 3,
            order: 1,
          },
          {
            label: `Média Geral (R$ ${mediaGeral.toFixed(2)})`,
            type: 'line' as const,
            data: labels.map(() => +mediaGeral.toFixed(4)),
            borderColor: '#10b981',
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false,
            tension: 0,
            order: 0,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 550, easing: 'easeOutQuart' },
        plugins: {
          title: {
            display: true,
            text: [
              'Preço Médio por Região',
              `${this.municipioSelecionado || ''} ${this.mesReferencia !== null ? '— ' + this.obterNomeMes(this.mesReferencia + 1) : ''} ${this.anoSelecionado}`.trim()
            ].filter(Boolean),
            font: { size: 14, weight: 'bold', family: "'Segoe UI', sans-serif" },
            color: this.chartColors().title,
            padding: { top: 8, bottom: 14 },
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              pointStyle: 'rectRounded',
              font: { size: 12 },
              color: this.chartColors().legend,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(17,24,39,0.92)',
            titleColor: '#f9fafb',
            bodyColor: '#d1fae5',
            borderColor: '#10b981',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.label?.startsWith('Média Geral'))
                  return ` ${ctx.dataset.label}`;
                return ` R$ ${(ctx.raw as number).toFixed(2)}/L`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: this.chartColors().ticks, font: { size: 11 } },
          },
          y: {
            title: { display: true, text: 'Preço Médio (R$/L)', color: this.chartColors().axis, font: { size: 11 } },
            min: yMin,
            max: yMax,
            grid: { color: this.chartColors().grid },
            ticks: {
              color: this.chartColors().ticks,
              font: { size: 11 },
              callback: (v) => `R$ ${Number(v).toFixed(2)}`,
            },
          },
        },
      }
    });
  }



  limparFiltros() {
  this.municipioSelecionado = 'geral'; // ou null, dependendo da lógica
  this.anoSelecionado = 2025//this.currentYear; // Reseta para o ano atual
  this.mesReferencia = null;
  this.faixaMin = null;
  this.faixaMax = null;
  this.laticinioSelecionado = 'todos';
  this.atualizarFiltros(); // Chama a função que atualiza os dados com os filtros limpos
}

  private agruparPorRegiao(dados: any[]) {
    const grupos: Record<string, { soma: number, qtd: number }> = {};
    const porLaticinio: Record<string, { soma: number, qtd: number }> = {};

    for (const d of dados) {
      const chave = `${d.regiao}-${d.laticinio}`;
      if (!porLaticinio[chave]) porLaticinio[chave] = { soma: 0, qtd: 0 };
      porLaticinio[chave].soma += d.precoLitro;
      porLaticinio[chave].qtd++;
    }

    for (const chave in porLaticinio) {
      const [regiao] = chave.split('-');
      const mediaLaticinio = porLaticinio[chave].soma / porLaticinio[chave].qtd;

      if (!grupos[regiao]) grupos[regiao] = { soma: 0, qtd: 0 };
      grupos[regiao].soma += mediaLaticinio;
      grupos[regiao].qtd++;
    }

    return Object.entries(grupos).map(([regiao, { soma, qtd }]) => ({
      regiao,
      mediaPreco: qtd > 0 ? soma / qtd : 0
    }));
  }

   atualizarFiltros() {
    this.criarGrafico();
    this.montarGraficoRegiao();
    this.montarGraficoMes();
  }

criarGrafico() {
  const coresSolidas = ['#0B5A68', '#FF7400', '#E00809', '#0078BD', '#9966FF', '#FF9F40'];

  let dados = this.dadosListFiltrados;
  const laticinios = Array.from(new Set(dados.map(d => d.laticinio)));

  const usarFaixaCustom = this.faixaMin !== null && this.faixaMax !== null;
  const faixas = usarFaixaCustom
    ? [{ label: `${this.faixaMin}–${this.faixaMax} L`, min: this.faixaMin!, max: this.faixaMax! }]
    : [
        { label: '0–100 L',     min: 0,    max: 100  },
        { label: '100–200 L',   min: 101,  max: 200  },
        { label: '200–400 L',   min: 201,  max: 400  },
        { label: '400–600 L',   min: 401,  max: 600  },
        { label: '600–800 L',   min: 601,  max: 800  },
        { label: '800–1000 L',  min: 801,  max: 1000 },
        { label: '1000–2000 L', min: 1001, max: 2000 }
      ];

  const mediaFaixaPorLaticinio = (items: any[], laticinio: string, min: number, max: number): number => {
    const filtrados = items.filter(i => i.laticinio === laticinio && i.producaoLitros >= min && i.producaoLitros <= max);
    if (filtrados.length === 0) return 0;
    return filtrados.reduce((acc, curr) => acc + curr.precoLitro, 0) / filtrados.length;
  };

  const faixasFiltradas = faixas.filter(f =>
    laticinios.some(lat => mediaFaixaPorLaticinio(dados, lat, f.min, f.max) > 0)
  );

  const canvas = document.getElementById('graficoLitrosPreco') as HTMLCanvasElement;
  if (!canvas) {
    // Canvas ainda não está no DOM; aguarda o próximo frame
    requestAnimationFrame(() => this.criarGrafico());
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Usa altura fixa — canvas.height é 0 antes do layout do browser
  const makeGradient = (cor: string, alpha1 = 0.85, alpha2 = 0.45): CanvasGradient => {
    const grad = ctx.createLinearGradient(0, 0, 0, 320);
    grad.addColorStop(0, cor + Math.round(alpha1 * 255).toString(16).padStart(2, '0'));
    grad.addColorStop(1, cor + Math.round(alpha2 * 255).toString(16).padStart(2, '0'));
    return grad;
  };

  // Calcula a média geral para linha de referência
  const todasMedias = laticinios.reduce((acc: number[], lat: string) =>
    acc.concat(faixasFiltradas.map(f => mediaFaixaPorLaticinio(dados, lat, f.min, f.max)).filter((v: number) => v > 0))
  , []);
  const mediaGeral = todasMedias.length
    ? todasMedias.reduce((a: number, b: number) => a + b, 0) / todasMedias.length
    : 0;

  const datasets: any[] = laticinios.map((lat, i) => {
    const cor = coresSolidas[i % coresSolidas.length];
    return {
      label: lat,
      data: faixasFiltradas.map(f => {
        const v = mediaFaixaPorLaticinio(dados, lat, f.min, f.max);
        return v > 0 ? +v.toFixed(4) : null;
      }),
      backgroundColor: makeGradient(cor),
      borderColor: cor,
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
      hoverBackgroundColor: cor + 'FF',
      hoverBorderWidth: 3,
    };
  });

  // Dataset de linha de média geral
  if (mediaGeral > 0) {
    datasets.push({
      label: 'Média Geral',
      type: 'line' as const,
      data: faixasFiltradas.map(() => +mediaGeral.toFixed(4)),
      borderColor: '#10b981',
      borderWidth: 2,
      borderDash: [6, 4],
      pointRadius: 0,
      fill: false,
      tension: 0,
      order: 0,
    });
  }

  const tituloLinhas: string[] = [];
  if (usarFaixaCustom) tituloLinhas.push(`Comparativo ${this.faixaMin}–${this.faixaMax} L`);
  else tituloLinhas.push('Preço por Faixa de Produção');
  if (this.municipioSelecionado && this.municipioSelecionado !== 'geral')
    tituloLinhas.push(`Município: ${this.municipioSelecionado}`);
  if (this.mesReferencia !== null) {
    const mesNome = this.mesesDisponiveis.find(m => m.valor === this.mesReferencia)?.nome;
    if (mesNome) tituloLinhas.push(`Mês: ${mesNome}`);
  }
  if (this.anoSelecionado !== null) tituloLinhas.push(`Ano: ${this.anoSelecionado}`);

  this.tituloGrafico = tituloLinhas.join(' | ');

  if (this.grafico) this.grafico.destroy();

  // Calcula eixo Y dinâmico
  const todosValores = laticinios.reduce((acc: number[], lat: string) =>
    acc.concat(faixasFiltradas.map(f => mediaFaixaPorLaticinio(dados, lat, f.min, f.max)).filter((v: number) => v > 0))
  , []);
  const yMin = todosValores.length ? Math.max(0, Math.min(...todosValores) - 0.2) : 0;
  const yMax = todosValores.length ? Math.max(...todosValores) + 0.2 : 5;

  this.grafico = new Chart(ctx, {
    type: 'bar',
    data: { labels: faixasFiltradas.map(f => f.label), datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 600,
        easing: 'easeOutQuart',
      },
      plugins: {
        title: {
          display: true,
          text: tituloLinhas,
          font: { size: 14, weight: 'bold', family: "'Segoe UI', sans-serif" },
          color: this.chartColors().title,
          padding: { top: 8, bottom: 16 },
        },
        legend: {
          position: 'bottom',
          labels: {
            padding: 16,
            usePointStyle: true,
            pointStyle: 'rectRounded',
            font: { size: 12 },
            color: this.chartColors().legend,
            filter: (item) => item.text !== 'Média Geral' || mediaGeral > 0,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.92)',
          titleColor: '#f9fafb',
          bodyColor: '#d1fae5',
          borderColor: '#10b981',
          borderWidth: 1,
          cornerRadius: 10,
          padding: 12,
          callbacks: {
            label: (ctx) => {
              if (ctx.dataset.label === 'Média Geral')
                return ` Média Geral: R$ ${(ctx.raw as number).toFixed(2)}`;
              const v = ctx.raw as number | null;
              return v != null
                ? ` ${ctx.dataset.label}: R$ ${v.toFixed(2)}/L`
                : ` ${ctx.dataset.label}: sem dados`;
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Faixa de Produção (litros/mês)', color: this.chartColors().axis, font: { size: 11 } },
          grid: { display: false },
          ticks: { color: this.chartColors().ticks, font: { size: 11 } },
        },
        y: {
          title: { display: true, text: 'Preço Médio (R$/L)', color: this.chartColors().axis, font: { size: 11 } },
          min: yMin,
          max: yMax,
          grid: { color: this.chartColors().grid },
          ticks: {
            color: this.chartColors().ticks,
            font: { size: 11 },
            callback: (v) => `R$ ${Number(v).toFixed(2)}`,
          },
        },
      },
    },
  });
}


  // --- Resto das funções de cálculo e agrupamento, todas usando this.dadosListFiltrados ---
  get dadosPorRegiao() {
    const grupos: Record<string, any[]> = {};

    for (const item of this.dadosListFiltrados) {
      if (this.mesReferencia !== null && item.mesReferencia !== this.mesReferencia) continue;
      if (this.anoSelecionado !== null && item.anoReferencia !== this.anoSelecionado) continue;

      if (!grupos[item.regiao]) grupos[item.regiao] = [];
      grupos[item.regiao].push(item);
    }

    return Object.entries(grupos).map(([regiao, items]) => {
      const mediaPreco = items.reduce((acc, curr) => acc + curr.precoLitro, 0) / items.length;
      const laticiniosMap: Record<string, { soma: number, count: number }> = {};
      for (const item of items) {
        if (!laticiniosMap[item.laticinio]) laticiniosMap[item.laticinio] = { soma: 0, count: 0 };
        laticiniosMap[item.laticinio].soma += item.precoLitro;
        laticiniosMap[item.laticinio].count++;
      }

      const laticinios = Object.entries(laticiniosMap).map(([laticinio, dados]) => ({
        laticinio,
        mediaPreco: dados.soma / dados.count,
      }));

      return { regiao, mediaPreco, laticinios };
    });
  }

 get tituloGraficoFiltrado(): string | null {
  const partes: string[] = [];

  if (this.municipioSelecionado && this.municipioSelecionado !== 'geral') {
    partes.push(`Município: ${this.municipioSelecionado}`);
  }

  if (this.mesReferencia !== null) {
    const mesNome = this.mesesDisponiveis.find(m => m.valor === this.mesReferencia)?.nome;
    if (mesNome) partes.push(`Mês: ${mesNome}`);
  }

  if (this.faixaMin !== null && this.faixaMax !== null) {
    partes.push(`Faixa: ${this.faixaMin}-${this.faixaMax} L`);
  }

  if (partes.length === 0) return null;

  // Retorna os filtros ativos separados por <br>
  return partes.join('<br><br>');
}

  getFaixaLitros(producaoLitros: number): string {
    if (producaoLitros >= 0 && producaoLitros <= 100) return '0-100';
    if (producaoLitros > 101 && producaoLitros <= 200) return '100-200';
    if (producaoLitros > 201 && producaoLitros <= 400) return '200-400';
    if (producaoLitros > 401 && producaoLitros <= 600) return '400-600';
     if (producaoLitros > 601 && producaoLitros <= 800) return '600-800';
    if (producaoLitros > 801 && producaoLitros <= 1000) return '800-1000';
     if (producaoLitros > 1001 && producaoLitros <= 2000) return '800-1000';
    return '1001+'; // se passar de 800, fica nessa faixa
  }


  temDadosFaixas(): boolean {
    return this.dadosPorLaticinioFaixas.some(grupo =>
      grupo.faixas.some(faixa => faixa.mediaPreco > 0)
    );
  }

  isFaixaValida(): boolean {
    return this.faixaMin !== null && this.faixaMax !== null && this.faixaMin < this.faixaMax;
  }

  get dadosPorLaticinioFaixas() {
    const grupos: Record<string, any[]> = {};

    let dadosFiltrados = this.dadosListFiltrados;

    // filtra por município e mês
    if (this.municipioSelecionado && this.municipioSelecionado !== 'geral') {
      dadosFiltrados = dadosFiltrados.filter(d => d.municipio === this.municipioSelecionado);
    }

    if (this.mesReferencia) {
      dadosFiltrados = dadosFiltrados.filter(d => d.mesReferencia === this.mesReferencia);
    }

    // agrupa por laticínio
    dadosFiltrados.forEach(item => {
      if (!grupos[item.laticinio]) grupos[item.laticinio] = [];
      grupos[item.laticinio].push(item);
    });

    // mapeia os grupos e calcula faixas
    const resultado = Object.entries(grupos).map(([laticinio, items]) => {
      let faixas;

      const makeFaixa = (label: string, min: number, max: number) => {
        const r = this.mediaFaixa(items, min, max);
        return { faixa: label, mediaPreco: r.media, quantidadeDados: r.quantidade };
      };

      if (this.isFaixaValida()) {
        const r = this.mediaFaixa(items, this.faixaMin!, this.faixaMax!);
        faixas = [{
          faixa: `${this.faixaMin} - ${this.faixaMax}`,
          mediaPreco: r.media,
          quantidadeDados: r.quantidade
        }];
      } else {
        faixas = [
          makeFaixa('0 - 100', 0, 100),
          makeFaixa('100 - 200', 101, 200),
          makeFaixa('200 - 400', 201, 400),
          makeFaixa('400 - 600', 401, 600),
          makeFaixa('600 - 800', 601, 800),
          makeFaixa('800 - 1000', 801, 1000),
          makeFaixa('1000 - 2000', 1001, 2000)
        ];
      }

      return {
        laticinio,
        mediaPreco: this.mediaPrecoPorLaticinio[laticinio] || 0,
        faixas
      };
    });

    // filtra apenas laticínios que tenham pelo menos uma faixa com média > 0
    return resultado.filter(grupo =>
      grupo.faixas.some(faixa => faixa.mediaPreco > 0)
    );
  }

  mediaFaixa(items: any[], min: number, max: number): { media: number; quantidade: number } {
    const filtrados = items.filter(i => i.producaoLitros > min - 1 && i.producaoLitros <= max);
    const media = filtrados.reduce((acc, curr) => acc + curr.precoLitro, 0) / Math.max(filtrados.length, 1);
    return { media, quantidade: filtrados.length };
  }

  get dadosPorMes() {
  const mesAtual = new Date().getMonth(); // 0-11

  const grupos: Record<number, any[]> = {};
  this.dadosListFiltrados.forEach(item => {
    if (!grupos[item.mesReferencia]) grupos[item.mesReferencia] = [];
    grupos[item.mesReferencia].push(item);
  });

  // Ordena pelos meses na ordem do ano (0-11)
  return Object.keys(grupos)
    .map(Number)
    .sort((a, b) => a - b)
    .map(mes => {
      const items = grupos[mes];
      const porLaticinio: Record<string, { soma: number; count: number }> = {};

      items.forEach((item: any) => {
        if (!porLaticinio[item.laticinio]) {
          porLaticinio[item.laticinio] = { soma: 0, count: 0 };
        }
        porLaticinio[item.laticinio].soma += item.precoLitro;
        porLaticinio[item.laticinio].count++;
      });

      const laticinios = Object.entries(porLaticinio).map(([laticinio, { soma, count }]) => ({
        laticinio,
        mediaPrecoDoLaticinio: soma / count
      }));

      return {
        mes: this.obterNomeMes(mes + 1),
        mesNumero: mes,
        items: laticinios,
        isAtual: mes === mesAtual
      };
    });
}

  get mediaPrecoPorLaticinioMes(): Record<string, Record<number, number>> {
    const total: Record<string, Record<number, { soma: number; count: number }>> = {};

    this.dadosListFiltrados.forEach(item => {
      if (!total[item.laticinio]) total[item.laticinio] = {};
      if (!total[item.laticinio][item.mesReferencia]) {
        total[item.laticinio][item.mesReferencia] = { soma: 0, count: 0 };
      }

      total[item.laticinio][item.mesReferencia].soma += item.precoLitro;
      total[item.laticinio][item.mesReferencia].count++;
    });

    // transforma em média
    const medias: Record<string, Record<number, number>> = {};
    Object.keys(total).forEach(laticinio => {
      medias[laticinio] = {};
      Object.keys(total[laticinio]).forEach(mes => {
        const { soma, count } = total[laticinio][Number(mes)];
        medias[laticinio][Number(mes)] = soma / count;
      });
    });

    return medias;
  }

  get mediaPrecoPorLaticinio(): Record<string, number> {
    const total: Record<string, { soma: number; count: number }> = {};
    this.dadosListFiltrados.forEach(item => {
      if (!total[item.laticinio]) total[item.laticinio] = { soma: 0, count: 0 };
      total[item.laticinio].soma += item.precoLitro;
      total[item.laticinio].count++;
    });

    const medias: Record<string, number> = {};
    for (const laticinio in total) {
      const { soma, count } = total[laticinio];
      medias[laticinio] = soma / count;
    }
    return medias;
  }

  obterNomeMes(mes: number): string {
    const nomes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    return nomes[mes - 1] || 'Desconhecido';
  }

  get regioesDisponiveis(): string[] {
    return Array.from(new Set(this.dadosListFiltrados.map(d => d.regiao))).sort();
  }

trackByLaticinio(index: number, item: any): string {
    // Retorna uma combinação única baseada em propriedades do item
    return `${item.regiao}-${item.laticinio}-${item.mediaPreco}`; // Ajuste conforme as propriedades disponíveis
  }

  trackByFaixa(index: number, item: any): string {
    // Retorna uma combinação única baseada em propriedades do item
    return `${item.laticinio}-${item.mediaPreco}-${item.faixa}`; // Ajuste conforme as propriedades disponíveis
  }

  montarGraficoMes() {
    if (!this._graficoMesRef?.nativeElement) return;

    const canvas = this._graficoMesRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Agrupa dados por mês e laticínio (reutiliza o getter dadosPorMes)
    const dadosMes = this.dadosPorMes;
    if (!dadosMes.length) return;

    const CORES = ['#0B5A68', '#FF7400', '#E00809', '#0078BD', '#9966FF', '#FF9F40', '#10b981', '#f59e0b'];

    // Coleta todos os laticínios presentes
    const laticiniosSet = new Set<string>();
    dadosMes.forEach(grupo => grupo.items.forEach((it: any) => laticiniosSet.add(it.laticinio)));
    const laticinios = Array.from(laticiniosSet);

    const labels = dadosMes.map(g => g.mes);

    const makeGrad = (cor: string): CanvasGradient => {
      const g = ctx.createLinearGradient(0, 0, 0, 320);
      g.addColorStop(0, cor + 'DD');
      g.addColorStop(1, cor + '55');
      return g;
    };

    const datasets = laticinios.map((lat, i) => {
      const cor = CORES[i % CORES.length];
      return {
        label: lat,
        data: dadosMes.map(grupo => {
          const item = grupo.items.find((it: any) => it.laticinio === lat);
          return item ? +item.mediaPrecoDoLaticinio.toFixed(4) : null;
        }),
        backgroundColor: makeGrad(cor),
        borderColor: cor,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBorderWidth: 3,
      };
    });

    // Linha de média geral
    const todosValores: number[] = [];
    dadosMes.forEach(g => g.items.forEach((it: any) => todosValores.push(it.mediaPrecoDoLaticinio)));
    const mediaGeral = todosValores.length
      ? todosValores.reduce((a: number, b: number) => a + b, 0) / todosValores.length
      : 0;

    if (mediaGeral > 0) {
      datasets.push({
        label: `Média Geral (R$ ${mediaGeral.toFixed(2)})`,
        type: 'line' as any,
        data: labels.map(() => +mediaGeral.toFixed(4)),
        borderColor: '#10b981',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
        tension: 0,
        order: 0,
        backgroundColor: 'transparent',
        borderSkipped: false,
        borderRadius: 0,
        hoverBorderWidth: 2,
      } as any);
    }

    const yMin = todosValores.length ? Math.max(0, Math.min(...todosValores) - 0.2) : 0;
    const yMax = todosValores.length ? Math.max(...todosValores) + 0.25 : 5;

    if (this.graficoMes) this.graficoMes.destroy();

    const tituloLinhas = ['Evolução de Preço por Mês'];
    if (this.municipioSelecionado && this.municipioSelecionado !== 'geral')
      tituloLinhas.push(`Município: ${this.municipioSelecionado}`);
    if (this.laticinioSelecionado !== 'todos')
      tituloLinhas.push(`Laticínio: ${this.laticinioSelecionado}`);
    if (this.anoSelecionado) tituloLinhas.push(`Ano: ${this.anoSelecionado}`);

    this.graficoMes = new Chart(canvas, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 550, easing: 'easeOutQuart' },
        plugins: {
          title: {
            display: true,
            text: tituloLinhas,
            font: { size: 14, weight: 'bold', family: "'Segoe UI', sans-serif" },
            color: this.chartColors().title,
            padding: { top: 8, bottom: 14 },
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              pointStyle: 'rectRounded',
              font: { size: 12 },
              color: this.chartColors().legend,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(17,24,39,0.92)',
            titleColor: '#f9fafb',
            bodyColor: '#d1fae5',
            borderColor: '#10b981',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.label?.startsWith('Média Geral'))
                  return ` ${ctx.dataset.label}`;
                const v = ctx.raw as number | null;
                return v != null
                  ? ` ${ctx.dataset.label}: R$ ${v.toFixed(2)}/L`
                  : ` ${ctx.dataset.label}: sem dados`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: this.chartColors().ticks, font: { size: 11 } },
          },
          y: {
            title: { display: true, text: 'Preço Médio (R$/L)', color: this.chartColors().axis, font: { size: 11 } },
            min: yMin,
            max: yMax,
            grid: { color: this.chartColors().grid },
            ticks: {
              color: this.chartColors().ticks,
              font: { size: 11 },
              callback: (v) => `R$ ${Number(v).toFixed(2)}`,
            },
          },
        },
      },
    });
  }

  onSegmentChange() {
    if (this.grafico) {
      this.grafico.destroy();
      this.grafico = null;
    }

    if (this.graficoRegiao) {
      this.graficoRegiao.destroy();
      this.graficoRegiao = undefined as any;
    }

    if (this.graficoMes) {
      this.graficoMes.destroy();
      this.graficoMes = undefined as any;
    }

    requestAnimationFrame(() => {
      if (this.agrupamentoSelecionado === 'laticinio') {
        this.criarGrafico();
      }
      if (this.agrupamentoSelecionado === 'regiao' && this.municipioSelecionado !== 'geral') {
        this.montarGraficoRegiao();
      }
      if (this.agrupamentoSelecionado === 'mes') {
        this.montarGraficoMes();
      }
    });
  }

}
