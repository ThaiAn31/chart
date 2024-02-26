import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  API_URL = 'http://127.0.0.1:7777/1/api'
  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<any> {
    const fakeData = {
      username: 'ROGER',
      usdtBalance: '500.00',
      goldBalance: '11',
    };
    return of(fakeData)

    // return this.http.get(`${environment.baseUrl}`)
  }
  getChartData(): Observable<any> {
    const fakeChartData = [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 90 },
      { x: 'Mar', y: 120 },
      { x: 'Apr', y: 180 },
      { x: 'May', y: 176 },
    ];
    return of(fakeChartData);
  }

  getDepositHistory() {
    // const fakeData = [
    //   { date: '15 JAN', amount: '50.00', status: 'PENDING' },
    //   { date: "13 JAN", amount: '30.00', status: "COMPLETED" },
    //   { date: "10 JAN", amount: '8.00', status: "COMPLETED" },
    //   { date: "06 JAN", amount: '3.00', status: "COMPLETED" },
    //   { date: "01 JAN", amount: '10.00', status: "COMPLETED" },
    // ];
    // return of(fakeData);
    return this.http.get(`${this.API_URL}/livebank/deposit/`)
  }

  getWithdrawHistory(): Observable<any[]> {
    const fakeData = [
      { date: '10 JAN', amount: '30.00', status: 'COMPLETED' },
    ];
    return of(fakeData);
  }

  getGiftHistory(): Observable<any[]> {
    const fakeData = [
      { date: '17 JAN', amount: '10.00', recipientUsername: 'ANDY', status: 'COMPLETED' },
    ];
    return of(fakeData);
  }
  getHost() {
    return this.API_URL;
  }
  postApi<T>(url: string, body: string): Observable<T>;
  postApi<T>(url: string, body: FormData): Observable<T>;
  postApi<T>(url: string, body: any): Observable<T>;
  postApi<T>(url: string, body: string | FormData | any) {
    if (typeof (body) === 'string') {
      console.log("this type is string");

      const headers = new HttpHeaders()
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
        .append('Accept', 'application/x-www-form-urlencoded')
        .append('Content-Type', 'application/x-www-form-urlencoded');
      const result = this.http.post<T>(url, body, { headers });
      return result;
    }
    else if (body instanceof FormData) {
      const options = {};
      const result = this.http.post<T>(url, body, options);
      return result;
    }
    else {
      const headers = new HttpHeaders()
        // .append('Access-Control-Allow-Origin', '*')
        // .append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')
        // .append('Accept', 'application/json')
        .append('Content-Type', 'application/json');
      const result = this.http.post<T>(url, body, { headers });
      return result;
    }
  }
}
