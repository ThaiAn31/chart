import { Component, OnInit } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-gift',
    templateUrl: './gift.page.html',
    styleUrls: ['./gift.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        HeaderComponent,
        FormsModule,
        NgFor,
    ],
})
export class GiftPage implements OnInit {
  giftHistory: any[] = []
  constructor(private giftService: TradeService) { }

  ngOnInit() {
    this.loadGiftHistory()
  }
  loadGiftHistory() {
    this.giftService.getGiftHistory().subscribe({
      next: (data) => {
        this.giftHistory = data;
      },
      error: (error) => {
        console.error('Error fetching deposit history:', error);
      },
    })
  }
}
