import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/chart1', pathMatch: 'full' },
    { path: 'chart1', loadComponent: () => import('./chart1/chart1.component').then(c => c.Chart1Component) },
      { path: 'chart2', loadComponent: () => import('./chart2/chart2.component').then(c => c.Chart2Component) },
      { path: 'chart3', loadComponent: () => import('./chart3/chart3.component').then(c => c.Chart3Component) },
      { path: 'chart4', loadComponent: () => import('./chart4/chart4.component').then(c => c.Chart4Component) },
      { path: 'chart5', loadComponent: () => import('./chart5/chart5.component').then(c => c.Chart5Component) },
    { path: '**', redirectTo: '/chart1' }
];
