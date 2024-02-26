import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderComponent } from '../../components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { CandleChartComponent } from 'src/app/components/chart/chart.component';
import { TvChartComponent } from 'src/app/components/tv-chart/tv-chart.component';
import { CandlebarChartComponent } from 'src/app/components/candlebar-chart/candlebar-chart.component';
import { AmchartComponent } from 'src/app/components/amchart/amchart.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, CandleChartComponent, TvChartComponent, CandlebarChartComponent, AmchartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  // private checkAuthentication(): void {
  //   this.authService.isAuthenticated.subscribe((authenticated: any) => {
  //     if (!authenticated) {
  //       // Nếu không đăng nhập, chuyển hướng về trang đăng nhập
  //       this.router.navigate(['/login']);
  //     }
  //   });
  // }
}
