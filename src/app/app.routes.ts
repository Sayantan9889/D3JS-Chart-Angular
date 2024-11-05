import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/chart1', pathMatch: 'full' },
    { path: 'chart1', loadComponent: () => import('./chart1/chart1.component').then(c => c.Chart1Component) },
      { path: 'chart2', loadComponent: () => import('./chart2/chart2.component').then(c => c.Chart2Component) },
    //   { path: 'canvas3', loadComponent: () => import('./canvas3/canvas3.component').then(c => c.Canvas3Component) },
    { path: '**', redirectTo: '/chart1' }
];
