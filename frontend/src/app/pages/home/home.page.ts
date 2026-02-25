import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
 import { Chart, registerables } from 'chart.js';

 Chart.register(...registerables);
@Component({
 selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {

  constructor() {}

 ngAfterViewInit(): void {

  const container = document.getElementById('cepea-widget');
  if (container) {
    container.innerHTML = ''; // limpa antes de inserir

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.cepea.org.br/br/widgetproduto.js.php?fonte=arial&tamanho=10&largura=400px&corfundo=dbd6b2&cortexto=333333&corlinha=ede7bf&id_indicador%5B%5D=leitep';
    script.async = true;

    script.onload = () => console.log('Widget CEPEA carregado com sucesso.');
    script.onerror = () => console.error('Erro ao carregar o widget CEPEA.');

    container.appendChild(script);
  } else {
    console.warn('Elemento #cepea-widget não encontrado no DOM.');
  }

   new Chart('cotacoesChart', {
        type: 'line',
        data: {
          labels: ['Set','Out', 'Nov', 'Dez'],
          datasets: [
            {
              label: 'Preço do Leite (R$/L)',
              data: [2.34, 2.21, 2.02, 1.88],
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
            legend: {
               display: false  // <- Isso esconde a legenda com a barrinha
            },
          },
          scales: {
            x: {
              ticks: {
                color: '#666',
              },
              title: {
                display: true,
                text: 'Mês',
                color: '#444',
              },
            },
            y: {
              beginAtZero: false,
              ticks: {
                color: '#666',
              },
              title: {
                display: true,
                text: 'Preço (R$)',
                color: '#444',
              },
            },
          },
        },
      });
 }
}
