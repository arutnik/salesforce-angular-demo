import { SalesforceApiService } from './sf-api-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private _sfApi: SalesforceApiService) {

  }

  title = 'app';

  ngOnInit() {
    this._sfApi.helloAngular("fellow enthusiast")
    .subscribe((name) => {
      this.title = name;
    })
  }

}
