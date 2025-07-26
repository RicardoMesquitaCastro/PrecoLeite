import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-data-parametros',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './data-parametros.component.html',
})
export class DataParametrosPage implements AfterViewInit, AfterViewChecked {
 @ViewChild('graficoRegiao', { static: false }) graficoRegiaoRef!: ElementRef<HTMLCanvasElement>;
  graficoRegiao!: Chart;
  graficoIniciado = false;
  agrupamentoSelecionado: string = 'laticinio';
  regiaoSelecionada: string | null = null;

  laticinio: string = '';
  mesReferencia: number | null = null;
  producaoLitros: number | null = null;
  precoLitro: number | null = null;
  ccs: number | null = null;
  cbt: number | null = null;
  gordura: number | null = null;
  proteina: number | null = null;

  dadosList = [
  // JL
  { laticinio: 'JL', regiao: 'Buritizinho', municipio: 'Orizona', mesReferencia: 5, producaoLitros: 90, precoLitro: 4.8, ccs: 6, cbt: 4, gordura: 3.9, proteina: 3.3 },
  { laticinio: 'JL', regiao: 'Taquaral', municipio: 'Orizona', mesReferencia: 6, producaoLitros: 160, precoLitro: 4.9, ccs: 5, cbt: 5, gordura: 4.1, proteina: 3.4 },
  { laticinio: 'JL', regiao: 'Apamac', municipio: 'Orizona', mesReferencia: 7, producaoLitros: 220, precoLitro: 5.0, ccs: 4, cbt: 4, gordura: 4.0, proteina: 3.6 },
  { laticinio: 'JL', regiao: 'teste', municipio: 'Orizona', mesReferencia: 8, producaoLitros: 300, precoLitro: 4.7, ccs: 6, cbt: 6, gordura: 3.8, proteina: 3.2 },
  { laticinio: 'JL', regiao: 'Firmeza', municipio: 'Orizona', mesReferencia: 9, producaoLitros: 410, precoLitro: 4.9, ccs: 5, cbt: 5, gordura: 4.2, proteina: 3.7 },

  // Mega Leite
  { laticinio: 'Piracanjuba', regiao: 'Taquaral', municipio: 'Orizona', mesReferencia: 5, producaoLitros: 120, precoLitro: 5.1, ccs: 3, cbt: 4, gordura: 4.0, proteina: 3.5 },
  { laticinio: 'Piracanjuba', regiao: 'Buritizinho', municipio: 'Orizona', mesReferencia: 6, producaoLitros: 250, precoLitro: 5.3, ccs: 2, cbt: 3, gordura: 4.3, proteina: 3.6 },
  { laticinio: 'Piracanjuba', regiao: 'Apamac', municipio: 'Orizona', mesReferencia: 7, producaoLitros: 320, precoLitro: 5.0, ccs: 4, cbt: 3, gordura: 4.1, proteina: 3.7 },
  { laticinio: 'Piracanjuba', regiao: 'Firmeza', municipio: 'Orizona', mesReferencia: 8, producaoLitros: 410, precoLitro: 5.2, ccs: 3, cbt: 3, gordura: 4.4, proteina: 3.8 },
  { laticinio: 'Piracanjuba', regiao: 'Firmeza', municipio: 'Orizona', mesReferencia: 9, producaoLitros: 500, precoLitro: 5.4, ccs: 2, cbt: 2, gordura: 4.6, proteina: 3.9 },

  // Nova Fazenda
  { laticinio: 'CCPR', regiao: 'Taquaral', municipio: 'Orizona', mesReferencia: 5, producaoLitros: 80, precoLitro: 4.5, ccs: 5, cbt: 5, gordura: 3.7, proteina: 3.1 },
  { laticinio: 'CCPR', regiao: 'Buritizinho', municipio: 'Orizona', mesReferencia: 6, producaoLitros: 140, precoLitro: 4.6, ccs: 6, cbt: 4, gordura: 3.8, proteina: 3.2 },
  { laticinio: 'CCPR', regiao: 'Firmeza', municipio: 'Orizona', mesReferencia: 7, producaoLitros: 210, precoLitro: 4.8, ccs: 5, cbt: 5, gordura: 4.0, proteina: 3.4 },
  { laticinio: 'CCPR', regiao: 'Buritizinho', municipio: 'Orizona', mesReferencia: 8, producaoLitros: 290, precoLitro: 4.9, ccs: 6, cbt: 6, gordura: 4.1, proteina: 3.5 },
  { laticinio: 'CCPR', regiao: 'Apamac', municipio: 'Orizona', mesReferencia: 9, producaoLitros: 380, precoLitro: 5.0, ccs: 5, cbt: 5, gordura: 4.3, proteina: 3.7 },

  // Leite Bom
  { laticinio: 'ITALAC', regiao: 'Taquaral', municipio: 'Orizona', mesReferencia: 5, producaoLitros: 150, precoLitro: 5.5, ccs: 3, cbt: 3, gordura: 4.4, proteina: 3.8 },
  { laticinio: 'ITALAC', regiao: 'Taquaral', municipio: 'Orizona', mesReferencia: 6, producaoLitros: 270, precoLitro: 5.6, ccs: 4, cbt: 3, gordura: 4.5, proteina: 3.9 },
  { laticinio: 'ITALAC', regiao: 'Buritizinho', municipio: 'Orizona', mesReferencia: 7, producaoLitros: 350, precoLitro: 5.7, ccs: 3, cbt: 2, gordura: 4.6, proteina: 4.0 },
  { laticinio: 'ITALAC', regiao: 'Buritizinho', municipio: 'Orizona', mesReferencia: 8, producaoLitros: 430, precoLitro: 5.8, ccs: 2, cbt: 3, gordura: 4.7, proteina: 4.1 },
  { laticinio: 'ITALAC', regiao: 'Apamac', municipio: 'Orizona', mesReferencia: 9, producaoLitros: 520, precoLitro: 5.9, ccs: 2, cbt: 2, gordura: 4.8, proteina: 4.2 },
];

  ngAfterViewInit() {
    this.criarGrafico();
      this.tentarMontarGrafico();

  }

  ngAfterViewChecked() {
  this.tentarMontarGrafico();
  }


 tentarMontarGrafico() {
    if (this.graficoIniciado) return; // evita múltiplas inicializações
    if (this.graficoRegiaoRef && this.graficoRegiaoRef.nativeElement) {
      this.montarGraficoRegiao();
      this.graficoIniciado = true;
    }
  }

montarGraficoRegiao() {
  const labels = this.dadosPorRegiao.map(g => g.regiao);
  const data = this.dadosPorRegiao.map(g => g.mediaPreco);

  // Cores diferentes para cada barra
  const backgroundColors = [
    'rgba(255, 99, 132, 0.6)',   // vermelho
    'rgba(54, 162, 235, 0.6)',   // azul
    'rgba(255, 206, 86, 0.6)',   // amarelo
    'rgba(75, 192, 192, 0.6)',   // verde-água
    'rgba(153, 102, 255, 0.6)',  // roxo
    'rgba(255, 159, 64, 0.6)'    // laranja
  ];

  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ];

  if (this.graficoRegiao) {
    this.graficoRegiao.destroy();
  }

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
        legend: {
         display: false  // <- Isso esconde a legenda com a barrinha
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 1.5, // valor inicial do eixo Y
          ticks: {
            stepSize: 0.1,
            precision: 2,
            callback: function (tickValue: string | number) {
              if (typeof tickValue === 'number') {
                return tickValue.toFixed(2);
              }
              return tickValue;
            }
          }
        },
        x: {
          ticks: {
            autoSkip: false
          }
        }
      }
    }
  });
}

criarGrafico() {
  const cores = [
    '#FF7400',
    '#E00809',
    '#0B5A68',
    '#0078BD',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
  ];

  const grupos: Record<string, Record<string, { precoTotal: number; count: number }>> = {};

  this.dadosList.forEach(item => {
    const faixa = this.getFaixaLitros(item.producaoLitros || 0);
    if (!grupos[item.laticinio]) grupos[item.laticinio] = {};
    if (!grupos[item.laticinio][faixa]) {
      grupos[item.laticinio][faixa] = { precoTotal: 0, count: 0 };
    }
    grupos[item.laticinio][faixa].precoTotal += item.precoLitro || 0;
    grupos[item.laticinio][faixa].count++;
  });

  const todasFaixas = Array.from(
    new Set(this.dadosList.map(item => this.getFaixaLitros(item.producaoLitros || 0)))
  ).sort((a, b) => {
    const minA = a === '401+' ? 401 : Number(a.split('-')[0]);
    const minB = b === '401+' ? 401 : Number(b.split('-')[0]);
    return minA - minB;
  });

  const labels = todasFaixas;

  const datasets = Object.keys(grupos).map((laticinio, i) => {
    const data = labels.map(faixa => {
      const grupo = grupos[laticinio][faixa];
      return grupo ? grupo.precoTotal / grupo.count : 0; // usar 0 em vez de null
    });

    return {
      label: laticinio,
      data,
      backgroundColor: cores[i % cores.length],
      borderWidth: 1,
    };
  });

  const ctx = (document.getElementById('graficoLitrosPreco') as HTMLCanvasElement)?.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets,
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `Preço médio: R$${context.raw}`,
          },
        },
        legend: {
          position: 'top',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Preço Médio (R$)',
          },
          beginAtZero: true,
        },
        y: {
          title: {
            display: true,
            text: 'Faixa de Litros',
          },
        },
      },
    },
  });
}

// Paleta de cores para os laticínios


  // Função que retorna a faixa de litros em intervalos de 100
 getFaixaLitros(producaoLitros: number): string {
  if (producaoLitros <= 100) return '0-100';
  if (producaoLitros <= 200) return '101-200';
  if (producaoLitros <= 300) return '201-300';
  if (producaoLitros <= 400) return '301-400';
  return '401+';
}
  // Agrupamento por laticínio e faixas de litros, com média de preço
  get dadosPorLaticinioFaixas() {
    const grupos: Record<string, any[]> = {};

    for (const item of this.dadosFiltradosPorRegiao) {
      if (!grupos[item.laticinio]) {
        grupos[item.laticinio] = [];
      }
      grupos[item.laticinio].push(item);
    }

    // Exemplo simples de faixa: agrupando por intervalo de litros
    // Aqui você pode adaptar a lógica para faixas reais que deseja
    return Object.entries(grupos).map(([laticinio, items]) => {
      // Exemplo: calcular média preço geral do laticínio
      const mediaPreco = this.mediaPrecoPorLaticinio[laticinio] || 0;

      // Criar faixas fictícias só para exibir (pode adaptar)
      const faixas = [
        {
          faixa: '0 - 200 L',
          mediaPreco: items
            .filter(i => i.producaoLitros <= 200)
            .reduce((acc, curr) => acc + curr.precoLitro, 0) / Math.max(items.filter(i => i.producaoLitros <= 200).length, 1)
        },
        {
          faixa: '201 - 400 L',
          mediaPreco: items
            .filter(i => i.producaoLitros > 200 && i.producaoLitros <= 400)
            .reduce((acc, curr) => acc + curr.precoLitro, 0) / Math.max(items.filter(i => i.producaoLitros > 200 && i.producaoLitros <= 400).length, 1)
        },
        {
          faixa: '401+ L',
          mediaPreco: items
            .filter(i => i.producaoLitros > 400)
            .reduce((acc, curr) => acc + curr.precoLitro, 0) / Math.max(items.filter(i => i.producaoLitros > 400).length, 1)
        }
      ];

      return {
        laticinio,
        mediaPreco,
        faixas
      };
    });
  }


  // Agrupamento por mês (exemplo seu)
  get dadosPorMes() {
    const grupos: Record<number, any[]> = {};

    for (const item of this.dadosFiltradosPorRegiao) {
      if (!grupos[item.mesReferencia]) {
        grupos[item.mesReferencia] = [];
      }
      grupos[item.mesReferencia].push(item);
    }

    return Object.entries(grupos).map(([mesReferencia, items]) => {
      return {
        mes: this.obterNomeMes(Number(mesReferencia)),
        items: items.map(item => ({
          ...item,
          mediaPrecoDoLaticinio: this.mediaPrecoPorLaticinio[item.laticinio]
        }))
      };
    });
  }

  get mediaPrecoPorLaticinio(): Record<string, number> {
    const totalPorLaticinio: Record<string, { soma: number, count: number }> = {};

    for (const item of this.dadosFiltradosPorRegiao) {
      if (!totalPorLaticinio[item.laticinio]) {
        totalPorLaticinio[item.laticinio] = { soma: 0, count: 0 };
      }
      totalPorLaticinio[item.laticinio].soma += item.precoLitro;
      totalPorLaticinio[item.laticinio].count += 1;
    }

    const medias: Record<string, number> = {};
    for (const laticinio in totalPorLaticinio) {
      const { soma, count } = totalPorLaticinio[laticinio];
      medias[laticinio] = soma / count;
    }
    return medias;
  }

  get dadosPorRegiao() {
  const grupos: Record<string, any[]> = {};

  // Agrupa dados filtrados por região
  for (const item of this.dadosList) {
    if (!grupos[item.regiao]) {
      grupos[item.regiao] = [];
    }
    grupos[item.regiao].push(item);
  }

  // Para cada região, calcule a média de preço total
  return Object.entries(grupos).map(([regiao, items]) => {
    // Média preço geral na região
    const mediaPreco = items.reduce((acc, curr) => acc + curr.precoLitro, 0) / items.length;

    // Pode colocar detalhes dos laticínios nessa região, se quiser
    // Exemplo: agrupar por laticínio e média por laticínio dentro da região
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
 const nomes = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];
  return nomes[mes - 1] || 'Desconhecido';
}

 get regioesDisponiveis(): string[] {
    const regioesSet = new Set(this.dadosList.map(d => d.regiao));
    return Array.from(regioesSet).sort();
  }
// Função para retornar dados filtrados pela região, ou todos se null
 get dadosFiltradosPorRegiao() {
    if (!this.regiaoSelecionada) {
      return this.dadosList;
    }
    return this.dadosList.filter(item => item.regiao === this.regiaoSelecionada);
  }

  // TrackBy para otimizar ngFor
  trackByLaticinio(index: number, item: any) {
    return item.laticinio;
  }

  trackByFaixa(index: number, item: any) {
    return item.faixa;
  }
}
