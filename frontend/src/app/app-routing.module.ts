import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {PageNotFoundComponent} from "./error/page-not-found/page-not-found.component";
import {LayoutComponent} from "./layout/layout/layout.component";
import {BrowserModule} from "@angular/platform-browser";
import {LogoutComponent} from "./logout/logout.component";

const routes: Routes = [
  {path: '', redirectTo:'dashboard', pathMatch: 'full'},
  {path: '', component: LayoutComponent, children: [
      {path: '', loadChildren: () => import('./layout/layout/layout.module').then(m => m.LayoutModule)}
    ]},
  {path: 'login', component: LoginComponent, pathMatch: 'full', title:'Sign In'},
  {path: 'logout', component: LogoutComponent, pathMatch: 'full', title:'Sign Out'},
  {path: '**', component: PageNotFoundComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
