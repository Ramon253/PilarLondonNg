import { Component,EventEmitter, HostBinding, Output, signal, NgModule } from '@angular/core';
import { NavLink } from './nav-link';
import {RouterLink, RouterLinkActive, Routes} from "@angular/router";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {
  public links : Array<NavLink> = [
    {
      name : 'migithub',
      url : 'https://github.com/ramon253'
    }
  ]
  
  DarkMode = signal<boolean>(JSON.parse(window.localStorage.getItem('darkMode') ?? 'false'))

  @Output('darkMode') darkMode = new EventEmitter<boolean>(this.DarkMode())

  toggleDarkMode(button : HTMLButtonElement){
    this.DarkMode.set(!this.DarkMode())
    this.darkMode.emit(this.DarkMode())
    button.classList.toggle('rotate-[360deg]')
    window.localStorage.setItem('darkMode', JSON.stringify(this.DarkMode()))
  }
}
