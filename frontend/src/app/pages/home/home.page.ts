import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { CadastroParametrosService } from 'src/app/services/cadastro-parametros.service';
import { environment } from 'src/environments/environment.prod';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, AfterViewInit {

  isAdmin = false;
  cotacoes: any[] = [];
  novoMes = '';
  mesInicio = '';
  mesFim = '';
  novoPreco: number | null = null;
  mensagem = '';
  grafico: Chart | null = null;

  // ── Indicadores ──────────────────────────────────────
  precoAtual: number | null = null;
  precoMaximo: number | null = null;
  precoMinimo: number | null = null;
  precoMedio: number | null = null;
  variacaoPercent: number | null = null;
  tendencia: 'alta' | 'baixa' | 'estavel' = 'estavel';

  // ── Alerta cadastro pendente ──────────────────────────
  mostrarAlertaCadastro = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cadastroParametrosService: CadastroParametrosService,
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.carregarCotacoes();
    this.verificarCadastroPendente();
  }

  ngAfterViewInit(): void {
    const container = document.getElementById('cepea-widget');
    if (container) {
      container.innerHTML = '';
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.cepea.org.br/br/widgetproduto.js.php?fonte=arial&tamanho=10&largura=400px&corfundo=dbd6b2&cortexto=333333&corlinha=ede7bf&id_indicador%5B%5D=leitep';
      script.async = true;
      container.appendChild(script);
    }
  }

 private verificarCadastroPendente() {
  if (!this.authService.isProdutor()) {
    this.mostrarAlertaCadastro = false;
    return;
  }

  // const hoje = new Date();
  // const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  // if (hoje.getDate() !== ultimoDiaMes) {
  //   this.mostrarAlertaCadastro = false;
  //   return;
  // }

  const hoje = new Date();
  const mesAtual = String(hoje.getMonth());
  const anoAtual = hoje.getFullYear();

  this.cadastroParametrosService.getMeus().subscribe({
    next: ({ rows }) => {
      const jaCadastrou = rows.some(d => {
        const anoCadastro = new Date(d.createdAt!).getFullYear();
        return d.mesReferencia === mesAtual && anoCadastro === anoAtual;
      });
      this.mostrarAlertaCadastro = !jaCadastrou;
    },
    error: () => { this.mostrarAlertaCadastro = false; }
  });
}

  carregarCotacoes() {
    this.http.get<any[]>(`${environment.apiUrl}/cotacoes`).subscribe({
      next: (dados) => {
        this.cotacoes = dados;
        this.calcularIndicadores(dados);
        this.renderizarGrafico(dados);
      },
      error: () => {
        const fallback = [
          { mes: 'Set', preco: 2.34 },
          { mes: 'Out', preco: 2.21 },
          { mes: 'Nov', preco: 2.02 },
          { mes: 'Dez', preco: 1.88 },
          { mes: 'Jan', preco: 2.02 },
        ];
        this.calcularIndicadores(fallback);
        this.renderizarGrafico(fallback);
      }
    });
  }

  calcularIndicadores(dados: any[]) {
    if (!dados.length) return;

    const precos = dados.map(d => d.preco);
    const hoje = new Date();
    const diaAtual = hoje.getDate();

    const idxFim = diaAtual < 25 ? dados.length - 2 : dados.length - 1;
    const idxInicio = Math.max(0, idxFim - 1);

    const dadoAtual    = dados[idxFim];
    const dadoAnterior = dados[idxInicio];

    this.precoAtual = dadoAtual?.preco ?? null;
    this.mesInicio  = dadoAnterior?.mes || '';
    this.mesFim     = dadoAtual?.mes || '';

    const precosVisiveis = dados.slice(0, idxFim + 1).map(d => d.preco);
    this.precoMaximo = Math.max(...precosVisiveis);
    this.precoMinimo = Math.min(...precosVisiveis);
    this.precoMedio  = precosVisiveis.reduce((a, b) => a + b, 0) / precosVisiveis.length;

    if (dadoAnterior?.preco) {
      this.variacaoPercent = (((this.precoAtual ?? 0) - dadoAnterior.preco) / dadoAnterior.preco) * 100;
      this.tendencia = this.variacaoPercent > 0.5 ? 'alta'
                     : this.variacaoPercent < -0.5 ? 'baixa'
                     : 'estavel';
    }
  }

  renderizarGrafico(dados: any[]) {
    if (this.grafico) {
      this.grafico.destroy();
    }

    const labels = dados.map(d => d.mes);
    const precos = dados.map(d => d.preco);

    this.grafico = new Chart('cotacoesChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Preço do Leite (R$/L)',
            data: precos,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4CAF50',
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: '#666' },
            title: { display: true, text: 'Mês', color: '#444' },
          },
          y: {
            beginAtZero: false,
            ticks: { color: '#666' },
            title: { display: true, text: 'Preço (R$)', color: '#444' },
          },
        },
      },
    });
  }

  adicionarCotacao() {
    if (!this.novoMes || !this.novoPreco) {
      this.mensagem = 'Preencha o mês e o preço.';
      return;
    }

    const token = this.authService.getToken();
    this.http.post(
      `${environment.apiUrl}/cotacoes`,
      { mes: this.novoMes, preco: this.novoPreco },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.mensagem = 'Cotação adicionada com sucesso!';
        this.novoMes = '';
        this.novoPreco = null;
        this.carregarCotacoes();
      },
      error: () => {
        this.mensagem = 'Erro ao adicionar cotação.';
      }
    });
  }

  excluirCotacao(id: string) {
    const token = this.authService.getToken();
    this.http.delete(
      `${environment.apiUrl}/cotacoes/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => this.carregarCotacoes(),
      error: () => { this.mensagem = 'Erro ao excluir.'; }
    });
  }
}
