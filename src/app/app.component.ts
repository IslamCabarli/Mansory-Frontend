import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoadingScreenComponent],
  template: `
    <app-loading-screen />
    <app-header />
    <router-outlet />
    <app-footer />
  `,
  styles: []
})
export class AppComponent {
  title = 'mansory-frontend';
}