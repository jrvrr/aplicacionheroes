import { Component } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { User } from '../../../auth/interfaces/user.interfaces';

@Component({
  selector: 'app-layout-page',
  standalone: false,
  
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

  constructor(private authService: AuthService){}

  get currentUser(): User | undefined {
    return this.authService.currentUser;
    }  
  
}
