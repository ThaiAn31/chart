import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: true,
    imports: [IonicModule, HeaderComponent],
})
export class DashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
