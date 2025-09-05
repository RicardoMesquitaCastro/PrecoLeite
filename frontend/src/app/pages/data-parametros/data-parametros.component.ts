import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { FaixaValidaPipe } from './faixa-valida.pipe';

Chart.register(...registerables);


@Component({
  selector: 'app-data-parametros',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, FaixaValidaPipe],
  templateUrl: './data-parametros.component.html',
    styleUrls: ['./data-parametros.component.scss']
})
export class DataParametrosPage implements AfterViewInit, AfterViewChecked, OnInit {
 @ViewChild('graficoRegiao', { static: false }) graficoRegiaoRef!: ElementRef<HTMLCanvasElement>;
  graficoRegiao!: Chart;
   grafico: Chart | null = null;
  graficoIniciado = false;
  agrupamentoSelecionado: string = 'laticinio';
  regiaoSelecionada: string | null = null;

  municipioSelecionado: string | null = "geral";
municipiosDisponiveis: string[] = [];
mesSelecionado: string = 'geral';

  laticinio: string = '';
  mesReferencia: number | null = null;
  producaoLitros: number | null = null;
  precoLitro: number | null = null;
  ccs: number | null = null;
  cbt: number | null = null;
  gordura: number | null = null;
  proteina: number | null = null;



mesesDisponiveis = [
  { nome: 'Janeiro', valor: 1 },
  { nome: 'Fevereiro', valor: 2 },
  { nome: 'Março', valor: 3 },
  { nome: 'Abril', valor: 4 },
  { nome: 'Maio', valor: 5 },
  { nome: 'Junho', valor: 6 },
  { nome: 'Julho', valor: 7 },
  { nome: 'Agosto', valor: 8 },
  { nome: 'Setembro', valor: 9 },
  { nome: 'Outubro', valor: 10 },
  { nome: 'Novembro', valor: 11 },
  { nome: 'Dezembro', valor: 12 },
];

  dadosList = [
  // JL
  { laticinio: 'JL', regiao: 'Buritizinho', municipio: 'Orizona', mesReferencia: 1, producaoLitros: 90, precoLitro: 2.5, ccs: 6, cbt: 4, gordura: 3.9, proteina: 3.3 },
  { laticinio: 'JL', regiao: 'Taquaral', municipio: 'Pires', mesReferencia: 1, producaoLitros: 160, precoLitro: 3.1, ccs: 5, cbt: 5, gordura: 4.1, proteina: 3.4 },
  { laticinio: 'JL', regiao: 'Apamac', municipio: 'Silvania', mesReferencia: 3, producaoLitros: 220, precoLitro: 5.0, ccs: 4, cbt: 4, gordura: 4.0, proteina: 3.6 },
  { laticinio: 'JL', regiao: 'Buritizinho', municipio: 'Orizona', mesReferencia: 12, producaoLitros: 470, precoLitro: 4.7, ccs: 6, cbt: 6, gordura: 3.8, proteina: 3.2 },
  { laticinio: 'JL', regiao: 'Firmeza', municipio: 'Orizona', mesReferencia: 12, producaoLitros: 410, precoLitro: 4.9, ccs: 5, cbt: 5, gordura: 4.2, proteina: 3.7 },

  // Mega Leite
  { laticinio: 'Piracanjuba', regiao: 'PiresRio', municipio: 'Pires', mesReferencia: 6, producaoLitros: 120, precoLitro: 5.1, ccs: 3, cbt: 4, gordura: 4.0, proteina: 3.5 },
  { laticinio: 'Piracanjuba', regiao: 'Buritizinho', municipio: 'Orizona', mesReferencia: 7, producaoLitros: 250, precoLitro: 5.3, ccs: 2, cbt: 3, gordura: 4.3, proteina: 3.6 },
  { laticinio: 'Piracanjuba', regiao: 'Apamac', municipio: 'Orizona', mesReferencia: 8, producaoLitros: 320, precoLitro: 5.0, ccs: 4, cbt: 3, gordura: 4.1, proteina: 3.7 },
  { laticinio: 'Piracanjuba', regiao: 'Firmeza', municipio: 'Silvania', mesReferencia: 9 , producaoLitros: 410, precoLitro: 5.2, ccs: 3, cbt: 3, gordura: 4.4, proteina: 3.8 },
  { laticinio: 'Piracanjuba', regiao: 'Firmeza', municipio: 'Orizona', mesReferencia: 10, producaoLitros: 500, precoLitro: 5.4, ccs: 2, cbt: 2, gordura: 4.6, proteina: 3.9 },

  // Nova Fazenda
  { laticinio: 'CCPR', regiao: 'Taquaral', municipio: 'Orizona', mesReferencia: 11, producaoLitros: 80, precoLitro: 4.5, ccs: 5, cbt: 5, gordura: 3.7, proteina: 3.1 },
  { laticinio: 'CCPR', regiao: 'Buritizinho', municipio: 'Silvania', mesReferencia: 2, producaoLitros: 140, precoLitro: 4.6, ccs: 6, cbt: 4, gordura: 3.8, proteina: 3.2 },
  { laticinio: 'CCPR', regiao: 'Firmeza', municipio: 'Orizona', mesReferencia:  1, producaoLitros: 210, precoLitro: 4.8, ccs: 5, cbt: 5, gordura: 4.0, proteina: 3.4 },
  { laticinio: 'CCPR', regiao: 'Buritizinho', municipio: 'Silvania', mesReferencia: 2, producaoLitros: 290, precoLitro: 4.9, ccs: 6, cbt: 6, gordura: 4.1, proteina: 3.5 },
  { laticinio: 'CCPR', regiao: 'Apamac', municipio: 'Orizona', mesReferencia: 3, producaoLitros: 380, precoLitro: 5.0, ccs: 5, cbt: 5, gordura: 4.3, proteina: 3.7 },

  // Leite Bom
  { laticinio: 'ITALAC', regiao: 'Taquaral', municipio: 'Pires', mesReferencia: 5, producaoLitros: 150, precoLitro: 5.5, ccs: 3, cbt: 3, gordura: 4.4, proteina: 3.8 },
  { laticinio: 'ITALAC', regiao: 'Taquaral', municipio: 'Pires', mesReferencia: 5, producaoLitros: 100, precoLitro: 3, ccs: 4, cbt: 3, gordura: 4.5, proteina: 3.9 },
  { laticinio: 'ITALAC', regiao: 'Buritizinho', municipio: 'Silvania', mesReferencia: 2, producaoLitros: 350, precoLitro: 5.7, ccs: 3, cbt: 2, gordura: 4.6, proteina: 4.0 },
  { laticinio: 'ITALAC', regiao: 'Buritizinho', municipio: 'Pires', mesReferencia: 8, producaoLitros: 430, precoLitro: 5.8, ccs: 2, cbt: 3, gordura: 4.7, proteina: 4.1 },
  { laticinio: 'ITALAC', regiao: 'Apamac', municipio: 'Orizona', mesReferencia: 12, producaoLitros: 520, precoLitro: 5.9, ccs: 2, cbt: 2, gordura: 4.8, proteina: 4.2 },
];

ngOnInit() {
    const unicos = new Set(this.dadosList.map(d => d.municipio));
    this.municipiosDisponiveis = Array.from(unicos);
  }

  ngAfterViewInit() {
    this.criarGrafico();
    this.tentarMontarGrafico();
  }

  ngAfterViewChecked() {
    this.tentarMontarGrafico();
  }

get dadosListFiltrados() {
  return this.dadosList.filter(d =>
    (this.municipioSelecionado === 'geral' || d.municipio === this.municipioSelecionado) &&
    (this.mesReferencia === null || d.mesReferencia === this.mesReferencia) //
  );
}

  tentarMontarGrafico() {
    if (this.graficoIniciado) return;
    if (this.graficoRegiaoRef?.nativeElement) {
      this.montarGraficoRegiao();
      this.graficoIniciado = true;
    }
  }

montarGraficoRegiao() {
  // 🔁 Filtra por município e mês
  const dadosFiltrados = this.dadosList.filter(d =>
  (this.municipioSelecionado === 'geral' || d.municipio === this.municipioSelecionado) &&
  (this.mesSelecionado === 'geral' || d.mesReferencia === Number(this.mesSelecionado))
);

  // Agrupa por região com base nos dados filtrados
  const dadosAgrupados = this.agruparPorRegiao(dadosFiltrados);

  const labels = dadosAgrupados.map(g => g.regiao);
  const data = dadosAgrupados.map(g => g.mediaPreco);

  const backgroundColors = [
    'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'
  ];
  const borderColors = backgroundColors.map(c => c.replace('0.6', '1'));

  if (this.graficoRegiao) this.graficoRegiao.destroy();

  this.graficoRegiao = new Chart(this.graficoRegiaoRef.nativeElement, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Média de Preço por Região (R$)',
        data,
        backgroundColor: backgroundColors.slice(0, data.length),
        borderColor: borderColors.slice(0, data.length),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 1.5,
          ticks: {
            stepSize: 0.1,
            precision: 2,
            callback: value => typeof value === 'number' ? value.toFixed(2) : value
          }
        },
        x: { ticks: { autoSkip: false } }
      }
    }
  });
}

atualizarFiltros() {
  this.criarGrafico(); // chama sua função que refaz o gráfico
}

agruparPorRegiao(dados: any[]): any[] {
  const mapa = new Map<string, { regiao: string, laticinios: any[], mediaPreco: number }>();

  for (const item of dados) {
    if (!mapa.has(item.regiao)) {
      mapa.set(item.regiao, { regiao: item.regiao, laticinios: [], mediaPreco: 0 });
    }
    const grupo = mapa.get(item.regiao)!;
    grupo.laticinios.push(item);
  }

  // Calcula média de preço por grupo
  for (const grupo of mapa.values()) {
    const soma = grupo.laticinios.reduce((acc, cur) => acc + cur.precoLitro, 0);
    grupo.mediaPreco = grupo.laticinios.length > 0 ? soma / grupo.laticinios.length : 0;
  }

  return Array.from(mapa.values());
}

  criarGrafico() {
  const cores = ['#FF7400', '#E00809', '#0B5A68', '#0078BD', '#9966FF', '#FF9F40'];

  // ✅ Aplica os filtros antes de agrupar
  let dados = this.dadosListFiltrados;

  // Filtro por município
  if (this.municipioSelecionado && this.municipioSelecionado !== 'geral') {
    dados = dados.filter(d => d.municipio === this.municipioSelecionado);
  }

  // Filtro por mês
  if (this.mesReferencia !== null) {
    dados = dados.filter(d => d.mesReferencia === this.mesReferencia);
  }

  // Filtro por faixa digitada
 if (this.faixaMin !== null && this.faixaMax !== null) {
  dados = dados.filter(d =>
    d.producaoLitros >= this.faixaMin! && d.producaoLitros <= this.faixaMax!
  );
}

  // Agrupamento por laticínio + faixa
  const grupos: Record<string, Record<string, { precoTotal: number; count: number }>> = {};

  dados.forEach(item => {
    const faixa = this.getFaixaLitros(item.producaoLitros || 0); // ainda usa função padrão
    if (!grupos[item.laticinio]) grupos[item.laticinio] = {};
    if (!grupos[item.laticinio][faixa]) grupos[item.laticinio][faixa] = { precoTotal: 0, count: 0 };

    grupos[item.laticinio][faixa].precoTotal += item.precoLitro;
    grupos[item.laticinio][faixa].count++;
  });

  // Descobre todas as faixas
  const todasFaixas = Array.from(
    new Set(dados.map(item => this.getFaixaLitros(item.producaoLitros || 0)))
  ).sort((a, b) => {
    const minA = a === '401+' ? 401 : Number(a.split('-')[0]);
    const minB = b === '401+' ? 401 : Number(b.split('-')[0]);
    return minA - minB;
  });

  // Monta os datasets
  const datasets = Object.keys(grupos).map((laticinio, i) => {
    const data = todasFaixas.map(faixa => {
      const g = grupos[laticinio][faixa];
      return g ? g.precoTotal / g.count : 0;
    });

    return {
      label: laticinio,
      data,
      backgroundColor: cores[i % cores.length],
      borderWidth: 1
    };
  });

  const ctx = (document.getElementById('graficoLitrosPreco') as HTMLCanvasElement)?.getContext('2d');
  if (!ctx) return;

  // Evita criar múltiplos gráficos em cima do mesmo canvas
  if (this.grafico) {
    this.grafico.destroy();
  }

  this.grafico = new Chart(ctx, {
    type: 'bar',
    data: { labels: todasFaixas, datasets },
    options: {
      indexAxis: 'x',
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `Preço médio: R$${context.raw}`
          }
        },
        legend: { position: 'top' }
      },
      scales: {
        x: { title: { display: true, text: 'Preço Médio (R$)' }, beginAtZero: true },
        y: { title: { display: true, text: 'Faixa de Litros' } }
      }
    }
  });
}

  getFaixaLitros(producaoLitros: number): string {
  if (producaoLitros >= 0 && producaoLitros <= 100) return '0-100';
  if (producaoLitros > 100 && producaoLitros <= 200) return '100-200';
  if (producaoLitros > 200 && producaoLitros <= 400) return '200-400';
  if (producaoLitros > 400 && producaoLitros <= 800) return '400-800';
  return '800+'; // se passar de 800, fica nessa faixa
}

faixaMin: number | null = null;
faixaMax: number | null = null;

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

    if (this.isFaixaValida()) {
      faixas = [{
        faixa: `${this.faixaMin} - ${this.faixaMax} L`,
        mediaPreco: this.mediaFaixa(items, this.faixaMin!, this.faixaMax!)
      }];
    } else {
      faixas = [
        { faixa: '0 - 100 L', mediaPreco: this.mediaFaixa(items, 0, 100) },
        { faixa: '100 - 200 L', mediaPreco: this.mediaFaixa(items, 100, 200) },
        { faixa: '200 - 400 L', mediaPreco: this.mediaFaixa(items, 200, 400) },
        { faixa: '400 - 800 L', mediaPreco: this.mediaFaixa(items, 400, 800) }
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

  mediaFaixa(items: any[], min: number, max: number) {
    const filtrados = items.filter(i => i.producaoLitros > min - 1 && i.producaoLitros <= max);
    return filtrados.reduce((acc, curr) => acc + curr.precoLitro, 0) / Math.max(filtrados.length, 1);
  }

get dadosPorMes() {
  const grupos: Record<number, any[]> = {};
  this.dadosListFiltrados.forEach(item => {
    if (!grupos[item.mesReferencia]) grupos[item.mesReferencia] = [];
    grupos[item.mesReferencia].push(item);
  });

  return Object.entries(grupos).map(([mes, items]) => {
    // Agrupar por laticínio dentro do mês
    const porLaticinio: Record<string, { soma: number; count: number }> = {};

    items.forEach(item => {
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
      mes: this.obterNomeMes(Number(mes)),
      items: laticinios
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

 get dadosPorRegiao() {
  const grupos: Record<string, any[]> = {};

  for (const item of this.dadosListFiltrados) {
    if (this.mesReferencia !== null && item.mesReferencia !== this.mesReferencia) continue;

    if (!grupos[item.regiao]) {
      grupos[item.regiao] = [];
    }
    grupos[item.regiao].push(item);
  }

  return Object.entries(grupos).map(([regiao, items]) => {
    const mediaPreco = items.reduce((acc, curr) => acc + curr.precoLitro, 0) / items.length;

    const laticiniosMap: Record<string, { soma: number, count: number }> = {};
    for (const item of items) {
      if (!laticiniosMap[item.laticinio]) {
        laticiniosMap[item.laticinio] = { soma: 0, count: 0 };
      }
      laticiniosMap[item.laticinio].soma += item.precoLitro;
      laticiniosMap[item.laticinio].count++;
    }

    const laticinios = Object.entries(laticiniosMap).map(([laticinio, dados]) => ({
      laticinio,
      mediaPreco: dados.soma / dados.count,
    }));

    return {
      regiao,
      mediaPreco,
      laticinios,
    };
  });
}

  obterNomeMes(mes: number): string {
    const nomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return nomes[mes - 1] || 'Desconhecido';
  }

  get regioesDisponiveis(): string[] {
    return Array.from(new Set(this.dadosListFiltrados.map(d => d.regiao))).sort();
  }

  trackByLaticinio(index: number, item: any) {
    return item.laticinio;
  }

  trackByFaixa(index: number, item: any) {
    return item.faixa;
  }
}
