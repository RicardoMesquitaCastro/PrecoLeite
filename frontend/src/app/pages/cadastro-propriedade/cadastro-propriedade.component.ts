import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CadastroPropriedade, CadastroPropriedadeService } from 'src/app/services/cadastro-propriedade.service';
import { RegistroService } from 'src/app/services/registro.service';

@Component({
  selector: 'app-cadastro-propriedade',
  templateUrl: './cadastro-propriedade.component.html',
  imports: [IonicModule, FormsModule],
  styleUrls: ['./cadastro-propriedade.component.scss'],
})
export class CadastroPropriedadeComponent {
  nomePropriedade = '';
  municipio = '';
  regiao = '';
  erro = '';

  constructor(
    private router: Router,
    private propriedadeService: CadastroPropriedadeService,
    private toastController: ToastController
  ) {}

async cadastrarPropriedade() {
    if (!this.nomePropriedade || !this.municipio || !this.regiao) {
      await this.mostrarToast('Preencha todos os campos.', 'danger');
      return;
    }

    const dados: CadastroPropriedade = {
      nomePropriedade: this.nomePropriedade,
      municipio: this.municipio,
      regiao: this.regiao,
    };

    try {
      const resposta = await this.propriedadeService.create(dados).toPromise();
      console.log('Propriedade cadastrada:', resposta);
      this.limparFormulario();
      await this.mostrarToast('Propriedade cadastrada com sucesso!', 'success');
      this.router.navigate(['/cadastro-parametros']);
    } catch (err: any) {
      await this.mostrarToast('Erro ao cadastrar propriedade: ' + (err?.message || 'Erro desconhecido'), 'danger');
    }
  }

  limparFormulario() {
    this.nomePropriedade = '';
    this.municipio = '';
    this.regiao = '';
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
