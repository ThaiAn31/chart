// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://127.0.0.1:7777/1/api/customer/'
  constructor(private http: HttpClient) { }
  private isLogin: boolean = false
  // private isAgent: boolean = false
  register = (customer: { name: string; phone: string; email: string; password: string }): Observable<any> => {
    this.isLogin = true;
    return this.http.post(`${this.API_URL}sign-up`, customer)
  }
  // registerAgent(customer: { name: string; phone: string; email: string; password: string }) {
  //   this.isLogin = true;
  //   this.isAgent = true;
  //   // Gọi API để lưu thông tin agent vào bảng customers
  //   return this.http.post(`${this.API_URL}sign-up`, customer)

  // }

  login = (customer: { email: string; password: string }): Observable<any> => {
    return this.http.post(`${this.API_URL}login`, customer)
  }



  logout() {
    return this.isLogin
  }

  isAuthenticated() {
  }
}
