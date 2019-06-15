import { Component } from '@angular/core';
import {NgxAdalService} from 'ngx-adal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular8-adal';

  constructor(private authService:NgxAdalService){



    if (!this.authService.isAuthenticated) {
      this.authService.login();
    }


    window['Logging'] = {
      level: 3,
      log: (message) => {
        console.log(message);
      }
    };

  }



  logout(){
    this.authService.logout();
  }
}
