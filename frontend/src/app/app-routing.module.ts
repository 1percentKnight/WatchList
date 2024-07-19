import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContentViewComponent } from './components/content-view/content-view.component';
import { AuthGuard } from './services/auth.guard';
import { ExploreComponent } from './components/explore/explore.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'content', component: ContentViewComponent
      }
    ]
  },
  { path: 'explore', component: ExploreComponent },
  { path: 'watchlist', component: HomeComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
