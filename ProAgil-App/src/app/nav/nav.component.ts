import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private toastr: ToastrService,
    public authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  loggedIn(){
    return this.authService.loggedIn();
  }
  
  logout(){
    this.authService.logout();
    this.toastr.show('Log Out');
    this.router.navigate(['/user/login/']);
  }

  entrar(){
    this.router.navigate(['/user/login/']);
  }

}
