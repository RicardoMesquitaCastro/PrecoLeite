import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
//import { AuthService } from 'src/app/services/auth.service';
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
   // private auth: AuthService,sss
    private router: Router,
   // private registroService: RegistroService // ✅ injetar
  ) {}

  cadastrarPropriedade() {
    if (!this.nomePropriedade || !this.municipio || !this.regiao) {
      this.router.navigate(['/cadastro-parametros']),
      this.erro = 'Preencha todos os campos.';
      return;
    }

    const dados = {
      propriedade: this.nomePropriedade,
      municipio: this.municipio,
      regiao: this.regiao,
    };

    // this.registroService.cadastrarPropriedade(dados).subscribe({
    //   next: () => this.router.navigate(['/cadastro-parametros']),
    //   error: () => (this.erro = 'Erro ao cadastrar propriedade'),
    // });
  }
}
