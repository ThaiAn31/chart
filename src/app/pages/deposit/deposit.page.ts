import { Component, OnInit } from '@angular/core';
// import { format } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { TradeService } from 'src/app/services/trade.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.page.html',
    styleUrls: ['./deposit.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        HeaderComponent,
        FormsModule,
        NgFor,
    ],
})
export class DepositPage implements OnInit {
  depositHistory: DepositItem[] = [];
  agent = '';
  customer = localStorage.getItem('name');
  amount = '';
  isAgent: boolean = false;


  constructor(private depositService: TradeService) { }

  ngOnInit() {
    this.loadDepositHistory();
  }
  loadDepositHistory() {
    this.depositService.getDepositHistory().subscribe({
      next: (data: any) => {
        this.depositHistory = data.data;
        console.log(data.data);

      },
      error: (error) => {
        console.error('Error fetching deposit history:', error);
      },
    })
  }
  deposit() {
    const body = {
      "org_id": 1,
      "is_agent": true,
      "agent_name": this.agent,
      "amount": this.amount,
      "balance": 0,
      "status": "1",
      "currency": "usd",
      "customer_id": 1,
      "customer_name": this.customer,
      "customer_email": "john@gmail.com",
      "customer_phone": "947743542",
      "customer_ref_no": "123456"
    };
    try {
      const rs = lastValueFrom(this.depositService.postApi(this.depositService.getHost() + 'api/livebank/deposit/addDepositView', body));
      console.log(rs);

    } catch (error) {
      console.log(error);
    }
    // Get the current date
    // const currentDate = new Date();

    // Format the date to '15 JAN' format
    // const formattedDate = format(currentDate, 'dd MMM');
    this.depositHistory.push({
      // agent: this.agent,
      // customer: this.customer,
      amount: this.amount.toString(),
      status: 'PENDING',
      date: "31 JAN"
    });
  }
  confirmDeposit() { }
}
interface DepositItem {
  date: string;
  amount: string;
  status: string;
}
