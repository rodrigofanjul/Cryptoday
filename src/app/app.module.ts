import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { ChartService } from './chart.service';
import { ConversorComponent } from './conversor/conversor.component';
import { LinksTableComponent } from './links-table/links-table.component';
import { LeadboardComponent } from './leadboard/leadboard.component';
import { CardComponent } from './card/card.component';
import { GraphicComponent } from './graphic/graphic.component';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ConversorComponent,
    LinksTableComponent,
    LeadboardComponent,
    CardComponent,
    GraphicComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule
  ],
  providers: [DataService,ChartService],
  bootstrap: [AppComponent]
})
export class AppModule { }