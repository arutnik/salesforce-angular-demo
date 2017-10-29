import { SalesforceHashLocationStrategy } from './util/sf-path-location-strategy';
import { LocationStrategy } from '@angular/common';
import { FirstPageComponent } from './components/first-page/first-page.component';
import { StaticPathPipe } from './pipes/static-path.pipe';
import { SalesforceApiService } from './sf-api-service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { AppComponent } from './app.component';
import { OtherPageComponent } from './components/other-page/other-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    StaticPathPipe,
    FirstPageComponent,
    OtherPageComponent 
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'other-page', component: OtherPageComponent},
      { path: "**", component: FirstPageComponent}
    ])
  ],
  providers: [
    SalesforceApiService,
    {
      provide: LocationStrategy,
      useClass: SalesforceHashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
