import { Component } from '@angular/core';
import { NgxAdalService } from 'ngx-adal-8';
import { APIService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  values: string[];

  constructor(private authService: NgxAdalService, private apiService: APIService) {
    window['Logging'] = {
      level: 3,
      log: message => {
        console.log(message);
      }
    };
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  getValues() {
    this.apiService.getValues().subscribe(values => (this.values = values));
  }

  getValuesAnon() {
    this.apiService.getValuesAnon().subscribe(values => (this.values = values));
  }
}
