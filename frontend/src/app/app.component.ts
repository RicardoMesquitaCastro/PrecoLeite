import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent implements OnInit {
  isLogado   = false;
  isProdutor = false;
  isAdmin = false

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.atualizarEstado();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.atualizarEstado());
  }

  private atualizarEstado() {
    this.isLogado   = this.authService.isAuthenticated();
    this.isProdutor = this.authService.isProdutor();
     this.isAdmin = this.authService.isAdmin();
  }

  fecharMenu() {
    this.menuCtrl.close();
  }

  sair() {
    this.menuCtrl.close().then(() => {
      this.authService.logout();
    });
  }
}
