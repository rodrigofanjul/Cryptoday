import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConversorComponent } from './conversor/conversor.component';
import { LinksTableComponent } from './links-table/links-table.component';


const routes: Routes = [
{
  path:'',
  component:ConversorComponent
},
{
  path:'links',
  component:LinksTableComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
