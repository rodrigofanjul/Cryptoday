import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {FormsModule } from '@angular/forms';

import {HttpClientModule} from '@angular/common/http';
import { DataService } from './data.service';
import { ConversorComponent } from './conversor/conversor.component';
import { LinksTableComponent } from './links-table/links-table.component';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ConversorComponent,
    LinksTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
