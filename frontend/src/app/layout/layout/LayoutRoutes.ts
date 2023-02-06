import {Routes} from "@angular/router";
import {DashboardComponent} from "../../pages/dashboard/dashboard.component";
import {UsersComponent} from "../../pages/users/users.component";
import {SettingsComponent} from "../../pages/settings/settings.component";

export const LayoutRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent, pathMatch: 'full', title: 'Dashboard'},
  {path: 'users', component: UsersComponent, pathMatch: 'full', title: 'Users'},
  {path: 'settings', component: SettingsComponent, pathMatch: 'full', title: 'Settings'}
]
