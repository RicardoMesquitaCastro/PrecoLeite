import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CadastroPropriedade, CadastroPropriedadeService } from 'src/app/services/cadastro-propriedade.service';
import { firstValueFrom } from 'rxjs';
import { IbgeService } from 'src/app/services/ibge.service';
@Component({
  selector: 'app-cadastro-propriedade',
  templateUrl: './cadastro-propriedade.component.html',
  imports: [CommonModule,   // 👈 necessário para *ngFor e *ngIf
    FormsModule,    // 👈 necessário para ngModel
    IonicModule     // 👈 necessário para ion-select
  ],
  styleUrls: ['./cadastro-propriedade.component.scss'],
})
export class CadastroPropriedadeComponent implements OnInit {
  nomePropriedade = '';
  municipio = '';
  povoado = '';
  regiao = '';
  erro = '';


  filtroMunicipio = '';
  listaMunicipios: any[] = [];
  municipiosFiltrados: any[] = [];
  povoadoOrz = [
  "Corumbajuba",
  "Montes Claros",
  "Taquaral",
  "Cachoeira",
  "Ubatan",
  "Buritizinho",
  "Posse",
  "Firmeza"
  ];
  modalAberto = false;


  constructor(
    private router: Router,
    private propriedadeService: CadastroPropriedadeService,
    private toastController: ToastController,
    private ibgeService: IbgeService
  ) { }

  ngOnInit() {
    this.carregarMunicipios();
  }

  abrirModalMunicipios() {
    this.modalAberto = true;
  }

  carregarMunicipios() {
    this.ibgeService.getMunicipiosPorUF('GO').subscribe({
      next: (dados) => {
        this.listaMunicipios = dados;
        this.municipiosFiltrados = dados; // inicia igual
      }
    });
  }

  filtrarMunicipios() {
    const termo = this.filtroMunicipio.trim().toLowerCase();

    this.municipiosFiltrados = this.listaMunicipios.filter(m =>
      m.nome.toLowerCase().includes(termo)
    );
  }

 selecionarMunicipio(nome: string) {
  this.municipio = nome;
  this.modalAberto = false;

  // Quando município for Orizona, troca campo por povoados
  if (nome.toLowerCase() === 'orizona') {
    this.regiao = '';   // limpa campo normal
    this.povoado = '';  // selecionará via select
  }
}

async cadastrarPropriedade() {
  // validações mínimas
  if (!this.nomePropriedade || !this.municipio) {
    await this.mostrarToast('Preencha o nome da propriedade e o município.', 'danger');
    return;
  }

  // Determina a região final:
  // - se município for Orizona -> usar povoado (se vazio, fallback "geral")
  // - se não for Orizona -> usar campo regiao (se vazio, fallback "geral")
  const isOrizona = this.municipio?.trim().toLowerCase() === 'orizona';

  const regiaoSelecionada = isOrizona
    ? (this.povoado?.trim() || 'geral')
    : (this.regiao?.trim() || 'geral');

  // monta o objeto a ser enviado com a região final
  const dados: CadastroPropriedade = {
    nomePropriedade: this.nomePropriedade,
    municipio: this.municipio,
    regiao: regiaoSelecionada,
  };

  try {
    // envia para o backend — usa firstValueFrom para poder await
    const resposta = await firstValueFrom(this.propriedadeService.create(dados));
    console.log('Propriedade cadastrada:', resposta);

    this.limparFormulario();
    await this.mostrarToast('Propriedade cadastrada com sucesso!', 'success');
    this.router.navigate(['/cadastro-parametros']);
  } catch (err: any) {
    console.error('Erro ao cadastrar:', err);
    await this.mostrarToast('Erro ao cadastrar propriedade: ' + (err?.message || 'Erro desconhecido'), 'danger');
  }
}

 limparFormulario() {
  this.nomePropriedade = '';
  this.municipio = '';
  this.regiao = '';
  this.povoado = '';
  this.erro = '';
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
}
