import { Component, HostBinding, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'PilarLondonNg';
  DarkMode = signal<boolean>(JSON.parse(window.localStorage.getItem('darkMode')?? 'false'));

  @HostBinding('class.dark') get mode() {
    return this.DarkMode()
  }
  
  setDarkMode(ev: boolean){
    this.DarkMode.set(ev)
  }
}
