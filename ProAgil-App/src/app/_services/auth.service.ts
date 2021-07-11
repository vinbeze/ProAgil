
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {map} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:5000/api/user/'
  JwtHelper = new JwtHelperService();
  decodeToken: any;

constructor(private http: HttpClient) { }



login(model: any){
  return this.http
    .post(`${this.baseUrl}login`,model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token',user.token);
          this.decodeToken = this.JwtHelper.decodeToken(user.token);
        }
      })
    );
}

register(model: any){
  return this.http.post(`${this.baseUrl}Register`,model)
}

loggedIn(){
  const token = localStorage.getItem('token');
  if(token != null){
    return this.JwtHelper.isTokenExpired(token);
  }
  return true;

  
}

logout(){
  localStorage.removeItem('token');
  
}



}

