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

    console.log(`codigo digitado: ${this.codigoAcesso}`);
    console.log(`senha digitada: ${this.senha}`);

  }

}
