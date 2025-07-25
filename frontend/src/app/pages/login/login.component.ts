import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [IonicModule, FormsModule, RouterModule], // IMPORTANTE
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {  usuario = '';
  senha = '';
  erro = '';

  constructor(private router: Router) {}

  login() {
    // Aqui você integraria com seu AuthService
    if (this.usuario === 'admin' && this.senha === '1234') {
      this.router.navigate(['/home']); // ou outra página
    } else {
      this.erro = 'Usuário ou senha inválidos';
    }
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro-conta']);
  }
}
