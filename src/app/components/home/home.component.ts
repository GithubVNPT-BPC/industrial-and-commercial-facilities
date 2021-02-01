import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  title = 'base';

  constructor(public httpClient: HttpClient, public messageService: MessageService) { }

  ngOnInit() {
  }

  request() {
    this.httpClient.get('https://api.github.com/users').subscribe(
      (res: Array<any>) => {
        console.log('result', res);

        this.messageService.add({
          severity: 'success',
          summary: 'Operación exitosa',
          detail: res.length + ' registros recibidos',
          life: 5000,
        });
      }
    );
  }

}
