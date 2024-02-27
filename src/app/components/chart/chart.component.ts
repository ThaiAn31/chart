import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';


import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexYAxis, ApexXAxis, ApexTitleSubtitle, NgApexchartsModule } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-candle-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule],

})
export class CandleChartComponent implements OnInit {
  chartOptions: Partial<ChartOptions>;
  close: any
  open: any
  @ViewChild("chart") chart: ChartComponent;
  dataChart: any[] = []
  constructor(private http: HttpClient) {
    this.chartOptions = {
      series: [
        {
          name: "candle",
          data: []//this.dataChart
        }
      ],
      chart: {
        type: "candlestick",
        height: 350,
        zoom: {
          enabled: true,
        },

        toolbar: {
          show: true
        },
        selection: {
          enabled: true
        },
        redrawOnWindowResize: false,
        redrawOnParentResize: false,
        brush: {
          enabled: false,
          target: undefined,
          autoScaleYaxis: false
        }
      },
      title: {
        align: "left"
      },
      xaxis: {
        type: "datetime",

      },
      yaxis: {
        tooltip: {
          enabled: true,

        },
        labels: {
          formatter: function (value) {
            return value.toFixed(2);
          }
        }
      },
    }
  }
  delta: any = 0;

  ngOnInit() {
    // this.getData();
    setInterval(() => {
      // this.updateData();
    }, 3000);

  }
  // getData() {
  //   this.http.get(`https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1&precision=1`).subscribe(
  //     {
  //       next: (data: any) => {
  //         console.log(data);
  //         this.dataChart = data.map((ohlcData: any) => ({
  //           x: new Date(ohlcData[0]),
  //           y: ohlcData.slice(1)
  //         }));
  //         this.chartOptions.series = [{ name: "candle", data: this.dataChart }];

  //         console.log(this.dataChart);
  //       },
  //       error: (error: any) => {
  //         console.log(error);
  //       }
  //     })
  // }

  public generateDayWiseTimeSeries(baseval: number, count: number, yrange: { max: number; min: number; }) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  generateRandomData() {
    // Tạo dữ liệu ngẫu nhiên cho mỗi nến
    for (let i = 0; i < 10; i++) {
      const newestDataTimestamp = this.dataChart[this.dataChart.length - 1].x.getTime();
      const startTimestamp = newestDataTimestamp - (50 * 5 * 1000); // Mỗi nến cách nhau 5 giây

      // Cập nhật thời gian bắt đầu mới cho trục x
      // this.chartOptions.xaxis.min = startTimestamp;
      // const open = Math.random() * 1000 + 50000;
      // const high = open + Math.random() * 500;
      // const low = open - Math.random() * 500;
      // const close = Math.random() * 1000 + 50000;
      // this.dataChart.unshift([startTimestamp, open, high, low, close]);
    }
    this.chartOptions.series = [{ name: "candle", data: this.dataChart }];
  }
  updateData() {
    this.delta = (Math.random() * 100 - 50).toFixed(2);

    // const timestamp = new Date().getTime();
    // const open = Math.random() * 1000 + 50000;
    // const high = open + Math.random() * 500;
    // const low = open - Math.random() * 500;
    // const close = Math.random() * 1000 + 50000;
    // this.dataChart.push([timestamp, open, high, low, close]);

    this.chartOptions.series = [{ name: "candle", data: this.dataChart }];

    if (close > open) {
      this.message = "Giá đang tăng, Nên bán ra";

    } else {
      this.message = "Giá đang giảm, Nên mua vào";
    }
    console.log(this.message);

  }
  message: string = '';
}
