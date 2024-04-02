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
  
  DarkMode = signal<boolean>(false)

  @Output('darkMode') darkMode = new EventEmitter<boolean>(this.DarkMode())

  toggleDarkMode(){
    this.DarkMode.set(!this.DarkMode())
    this.darkMode.emit(this.DarkMode())
  }
}
