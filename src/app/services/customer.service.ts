import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }
  private API_URL = 'http://127.0.0.1:7777/1/api/'


  getCustomerInfo(id: number) {
    return this.http.get(`${this.API_URL}customer/${id}`)
  }

  getCustomerBalance(customerId: number) {
    return this.http.get(`${this.API_URL}livebank/savinggoldBalance/${customerId}`)
  }

  getPositionsCustomerId(customerId: number) { }

}
