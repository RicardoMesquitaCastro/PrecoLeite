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
  imports: [CommonModule, FormsModule, IonicModule],
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
    'Corumbajuba', 'Montes Claros', 'Taquaral',
    'Cachoeira', 'Ubatan', 'Buritizinho', 'Posse', 'Firmeza'
  ];
  modalAberto = false;
  modoManualPovoado = false;

  constructor(
    private router: Router,
    private propriedadeService: CadastroPropriedadeService,
    private toastController: ToastController,
    private ibgeService: IbgeService
  ) {}

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
        this.municipiosFiltrados = dados;
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
    this.modoManualPovoado = false;
    this.povoado = '';
    this.regiao = '';
  }

  async cadastrarPropriedade() {
    if (!this.nomePropriedade || !this.municipio) {
      await this.mostrarToast('Preencha o nome da propriedade e o município.', 'danger');
      return;
    }

    const isOrizona = this.municipio?.trim().toLowerCase() === 'orizona';
    const regiaoSelecionada = isOrizona
      ? (this.povoado?.trim() || 'geral')
      : (this.regiao?.trim() || 'geral');

    const dados: CadastroPropriedade = {
      nomePropriedade: this.nomePropriedade,
      municipio: this.municipio,
      regiao: regiaoSelecionada,
      // contaId é adicionado automaticamente pelo service com o id do usuário logado
    };

    try {
      await firstValueFrom(this.propriedadeService.create(dados));
      this.limparFormulario();
      await this.mostrarToast('Propriedade cadastrada com sucesso!', 'success');
      // Redireciona para home após cadastro
      this.router.navigate(['/home']);
    } catch (err: any) {
      console.error('Erro ao cadastrar:', err);
      await this.mostrarToast('Erro ao cadastrar propriedade.', 'danger');
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
