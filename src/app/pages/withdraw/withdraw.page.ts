import { Component, OnInit } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.page.html',
    styleUrls: ['./withdraw.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        HeaderComponent,
        FormsModule,
        NgFor,
    ],
})
export class WithdrawPage implements OnInit {
  withdrawHistory: any[] = [];
  constructor(private withdrawService: TradeService) { }

  ngOnInit() {
    this.loadWidthdrawHistory();
  }
  loadWidthdrawHistory() {
    this.withdrawService.getWithdrawHistory().subscribe({
      next: (data) => {
        this.withdrawHistory = data;
      },
      error: (error) => {
        console.error('Error fetching deposit history:', error);
      },
    })
  }

}
