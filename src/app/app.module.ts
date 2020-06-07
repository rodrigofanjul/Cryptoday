import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

import {HttpClientModule} from '@angular/common/http';
import { DataService } from './data.service';
import { ConversorComponent } from './conversor/conversor.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ConversorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
