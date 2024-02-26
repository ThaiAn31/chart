import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { TradeService } from 'src/app/services/trade.service';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [NgIf, IonicModule],
})
export class HeaderComponent implements OnInit {
  // name!: string;
  // email!: string;
  // apparea!: string;
  // customerId!: string;
  data: any
  customer: any
  usdtBalance: string = 'Loading...';
  goldBalance: string = 'Loading...';
  customerBalance = {}
  constructor(private customerService: CustomerService, moneyService: TradeService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // this.getUserInfo()
    this.getCustomerInfo()

    // const islogin = localStorage.getItem("islogin");

    // if (islogin != "1") {
    //   this.router.navigate(['/'])
    // }
    // else {
    //   const id = localStorage.getItem("id")
    //   const name = localStorage.getItem("name")
    //   const email = localStorage.getItem("email")
    //   const apparea = localStorage.getItem("apparea")
    //   const customerId = localStorage.getItem("customerId")
    //   const cash_balance = localStorage.getItem("cash_balance")
    //   const gold_balance = localStorage.getItem("gold_balance")
    //   console.log(apparea);
    // }
  }

  getCustomerInfo() {
    const customerId = localStorage.getItem('customerId')
    console.log(customerId);

    if (customerId) {
      try {
        this.customerService.getCustomerInfo(+customerId).subscribe(
          {
            next: (data: any) => {
              this.customer = data.data
              console.log(data.data);
            },
            error: (error) => {
              console.error('Error getting customer info:', error);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
  getCustomerBalance = async (customerId: number) => {
    console.log(customerId);
    try {
      this.customerService.getCustomerInfo(+customerId).subscribe(
        {
          next: (data: any) => {
            this.customer = data.data
            console.log(data.data);
            // Gọi hàm lấy balance sau khi có thông tin khách hàng
          },
          error: (error) => {
            console.error('Error getting customer info:', error);
          }
        }
      );

    } catch (error) {

    }
  }
  logout = () => {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
