import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

import {
  EstatisticasService,
  EstatisticasDetalhe,
  FiltroDetalhe,
} from '../../services/estatisticas.service';

Chart.register(...registerables);

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const CORES = ['#0B5A68','#FF7400','#E00809','#0078BD','#9966FF','#FF9F40','#10b981','#f59e0b'];

@Component({
  selector: 'app-detalhe-estatistica',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './detalhe-estatistica.component.html',
  styleUrls: ['./detalhe-estatistica.component.scss'],
})
export class DetalheEstatisticaPage implements OnInit, AfterViewInit {

  @ViewChild('graficoMunicipio')
  private graficoMunicipioRef?: ElementRef<HTMLCanvasElement>;

  filtro!: FiltroDetalhe;
  stats: EstatisticasDetalhe | null = null;
  carregando = true;

  tituloPage  = 'Detalhe';
  heroTitulo  = '';
  heroSubtitulo = '';
  heroIcon    = 'stats-chart-outline';
  laticinioIcon: string | null = null;

  dadosPorMunicipio: { municipio: string; media: number }[] = [];

  private graficoMunicipioCh?: Chart;

  readonly laticinioIcons: Record<string, string> = {
    'JL':          'assets/icon/valeza.png',
    'CCPR':        'assets/icon/ccpr.png',
    'Piracanjuba': 'assets/icon/piracanjuba.png',
    'Italac':      'assets/icon/italac.png',
    'Nestle':      'assets/icon/nestle.jpg',
    'Marajoara':   'assets/icon/marajoara.jpg',
  };

  constructor(
    private route: ActivatedRoute,
    private estatisticasService: EstatisticasService,
  ) {}

  ngOnInit() {
    // Lê os parâmetros de navegação enviados via state (router extras)
    const nav  = history.state as FiltroDetalhe & { [k: string]: any };
    this.filtro = {
      tipo:       nav['tipo']       ?? 'laticinio',
      laticinio:  nav['laticinio'],
      faixaMin:   nav['faixaMin']   != null ? Number(nav['faixaMin'])  : undefined,
      faixaMax:   nav['faixaMax']   != null ? Number(nav['faixaMax'])  : undefined,
      mesNumero:  nav['mesNumero']  != null ? Number(nav['mesNumero']) : undefined,
      mesNome:    nav['mesNome'],
      regiao:     nav['regiao'],
      municipio:  nav['municipio'],
      ano:        nav['ano']        != null ? Number(nav['ano'])       : undefined,
    };

    this.prepararCabecalho();
    this.carregar();
  }

  ngAfterViewInit() {
    // O canvas pode ainda não estar no DOM; o setter de ViewChild cuidará disso
  }

  // ── ViewChild setter: monta gráfico quando o canvas aparecer no DOM ──
  @ViewChild('graficoMunicipio')
  set graficoMunicipioSetter(ref: ElementRef<HTMLCanvasElement> | undefined) {
    if (!ref || !this.dadosPorMunicipio.length) return;
    this.graficoMunicipioRef = ref;
    requestAnimationFrame(() => this.montarGraficoMunicipio());
  }

 private carregar() {
  this.carregando = true;
  this.estatisticasService.getDados().subscribe((dados: any) => {
    this.stats = this.estatisticasService.calcularEstatisticas(dados, this.filtro);
    this.dadosPorMunicipio = this.calcularPorMunicipio(dados);
    this.carregando = false;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.montarGraficoMunicipio());
    });
  });
}

  private prepararCabecalho() {
    const f = this.filtro;

    if (f.tipo === 'laticinio') {
      this.heroIcon      = 'business-outline';
      this.heroTitulo    = f.laticinio ?? 'Laticínio';
      this.laticinioIcon = this.laticinioIcons[f.laticinio ?? ''] ?? null;
      const partes: string[] = [];
      if (f.municipio && f.municipio !== 'geral') partes.push(f.municipio);
      if (f.ano) partes.push(String(f.ano));
      if (f.faixaMin != null && f.faixaMax != null) partes.push(`${f.faixaMin}–${f.faixaMax} L`);
      this.heroSubtitulo = partes.join(' · ') || 'Todos os dados';
      this.tituloPage    = f.laticinio ?? 'Laticínio';
    }

    if (f.tipo === 'mes') {
      this.heroIcon      = 'calendar-outline';
      this.heroTitulo    = f.mesNome ?? MESES[f.mesNumero ?? 0];
      const partes: string[] = [];
      if (f.municipio && f.municipio !== 'geral') partes.push(f.municipio);
      if (f.ano) partes.push(String(f.ano));
      this.heroSubtitulo = partes.join(' · ') || 'Todos os dados';
      this.tituloPage    = this.heroTitulo;
    }

    if (f.tipo === 'regiao') {
      this.heroIcon      = 'map-outline';
      this.heroTitulo    = f.regiao ?? 'Região';
      const partes: string[] = [];
      if (f.municipio && f.municipio !== 'geral') partes.push(f.municipio);
      if (f.ano) partes.push(String(f.ano));
      this.heroSubtitulo = partes.join(' · ') || 'Todos os dados';
      this.tituloPage    = this.heroTitulo;
    }
  }

  private calcularPorMunicipio(dados: any[]) {
    const grupos: Record<string, { soma: number; count: number }> = {};

    // Aplica apenas os filtros não-municipio para o gráfico comparativo
    const filtrados = dados.filter(d => {
      if (this.filtro.ano && d.anoReferencia !== this.filtro.ano) return false;
      if (this.filtro.tipo === 'laticinio' && this.filtro.laticinio && d.laticinio !== this.filtro.laticinio) return false;
      if (this.filtro.tipo === 'mes' && this.filtro.mesNumero != null && d.mesReferencia !== this.filtro.mesNumero) return false;
      if (this.filtro.tipo === 'regiao' && this.filtro.regiao && d.regiao !== this.filtro.regiao) return false;
      return true;
    });

    filtrados.forEach((d: any) => {
      if (!grupos[d.municipio]) grupos[d.municipio] = { soma: 0, count: 0 };
      grupos[d.municipio].soma  += d.precoLitro;
      grupos[d.municipio].count++;
    });

    return Object.entries(grupos)
      .map(([municipio, { soma, count }]) => ({ municipio, media: soma / count }))
      .sort((a, b) => b.media - a.media);
  }

  private montarGraficoMunicipio() {
    if (!this.graficoMunicipioRef?.nativeElement) return;
    if (!this.dadosPorMunicipio.length) return;

    const canvas = this.graficoMunicipioRef.nativeElement;
    const ctx    = canvas.getContext('2d');
    if (!ctx) return;

    const dark   = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const colors = {
      title:  dark ? '#f0f0f0' : '#1a2332',
      ticks:  dark ? '#d1d5db' : '#4b5563',
      axis:   dark ? '#9ca3af' : '#6b7280',
      grid:   dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
    };

    const labels  = this.dadosPorMunicipio.map(d => d.municipio);
    const valores  = this.dadosPorMunicipio.map(d => +d.media.toFixed(4));
    const media    = valores.reduce((a, b) => a + b, 0) / valores.length;

    const makeGrad = (cor: string) => {
      const g = ctx.createLinearGradient(0, 0, 0, 280);
      g.addColorStop(0, cor + 'DD');
      g.addColorStop(1, cor + '55');
      return g;
    };

    if (this.graficoMunicipioCh) this.graficoMunicipioCh.destroy();

    this.graficoMunicipioCh = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Preço Médio (R$/L)',
            data: valores,
            backgroundColor: labels.map((_, i) => makeGrad(CORES[i % CORES.length])),
            borderColor:     labels.map((_, i) => CORES[i % CORES.length]),
            borderWidth: 2,
            borderRadius: 10,
            borderSkipped: false,
          },
          {
            label: `Média Geral (R$ ${media.toFixed(2)})`,
            type: 'line' as const,
            data: labels.map(() => +media.toFixed(4)),
            borderColor: '#10b981',
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 14, usePointStyle: true, pointStyle: 'rectRounded', font: { size: 11 }, color: colors.ticks },
          },
          tooltip: {
            backgroundColor: 'rgba(17,24,39,0.92)',
            titleColor: '#f9fafb',
            bodyColor: '#d1fae5',
            borderColor: '#10b981',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 10,
            callbacks: {
              label: (c) => {
                if (c.dataset.label?.startsWith('Média Geral')) return ` ${c.dataset.label}`;
                return ` R$ ${(c.raw as number).toFixed(4)}/L`;
              },
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: colors.ticks, font: { size: 10 } } },
          y: {
            title: { display: true, text: 'Preço Médio (R$/L)', color: colors.axis, font: { size: 10 } },
            min: valores.length ? Math.max(0, Math.min(...valores) - 0.15) : 0,
            max: valores.length ? Math.max(...valores) + 0.2 : 5,
            grid: { color: colors.grid },
            ticks: { color: colors.ticks, font: { size: 10 }, callback: v => `R$ ${Number(v).toFixed(2)}` },
          },
        },
      },
    });
  }

  nomeMes(indice: number): string {
    return MESES[indice] ?? 'Desconhecido';
  }


  get registrosAgrupados() {
  const grupos: Record<string, { chave: string; mesNome: string; ano: number; itens: any[] }> = {};

  for (const item of this.stats?.itens ?? []) {
    const chave = `${item.anoReferencia}-${item.mesReferencia}`;
    if (!grupos[chave]) {
      grupos[chave] = {
        chave,
        mesNome: MESES[item.mesReferencia] ?? 'Desconhecido',
        ano: item.anoReferencia,
        itens: [],
      };
    }
    grupos[chave].itens.push(item);
  }

  // Ordena do mais recente para o mais antigo
  return Object.values(grupos).sort((a, b) =>
    b.ano !== a.ano ? b.ano - a.ano : b.itens[0].mesReferencia - a.itens[0].mesReferencia
  );
}

}
