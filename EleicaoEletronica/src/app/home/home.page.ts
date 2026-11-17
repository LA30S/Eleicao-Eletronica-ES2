import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, FormsModule],
})
export class HomePage {

  codigoAcesso: string = '';
  senha: string = '';

  constructor(private http: HttpClient) {}

  fazerLogin() {
    const payload = {
      codigoAcesso: this.codigoAcesso,
      senha: this.senha
    };

    this.http.post<any>('http://localhost:3000/auth/login', payload).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('perfil', res.usuario.perfil);
        alert(`Login realizado! Perfil: ${res.usuario.perfil}`);
      },
      error: (err) => {
        alert(err.error?.erro || 'Erro ao realizar login');
      }
    });
  }

}
