import { Component, OnInit, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke,
  NgApexchartsModule
} from "ng-apexcharts";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-candlebar-chart',
  templateUrl: './candlebar-chart.component.html',
  styleUrls: ['./candlebar-chart.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule],
})
export class CandlebarChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartCandleOptions: Partial<ChartOptions>;
  public chartBarOptions: Partial<ChartOptions>;
  dataChart: any[] = []
  delta: any = 0
  constructor() {
    this.chartCandleOptions = {
      series: [
        {
          name: "candle",
          data: []
        }
      ],
      chart: {
        type: "candlestick",
        height: 290,
        id: "candles",
        toolbar: {
          autoSelected: "pan",
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      // plotOptions: {
      //   candlestick: {
      //     colors: {
      //       upward: "#3C90EB",
      //       downward: "#DF7D46"
      //     }
      //   }
      // },
      xaxis: {
        type: "datetime"
      }
    };

    this.chartBarOptions = {
      series: [
        {
          name: "volume",
          data: []
        }
      ],
      chart: {
        height: 160,
        type: "bar",
        brush: {
          enabled: true,
          target: "candles"
        },
        selection: {
          enabled: true,
          xaxis: {
            min: new Date("20 Jan 2017").getTime(),
            max: new Date("10 Dec 2017").getTime()
          },
          fill: {
            color: "#ccc",
            opacity: 0.4
          },
          stroke: {
            color: "#0D47A1"
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          columnWidth: "%",
          colors: {
            ranges: [
              {
                from: -1000,
                to: 0,
                color: "#F15B46"
              },
              {
                from: 1,
                to: 10000,
                color: "#FEB019"
              }
            ]
          }
        }
      },
      stroke: {
        width: 0
      },
      xaxis: {
        type: "datetime",
        axisBorder: {
          offsetX: 13
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  }

  ngOnInit() {
    setInterval(() => {
      this.updateData();
    }, 1000);
  }
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
      this.chartCandleOptions.xaxis.min = startTimestamp;
      const open = Math.random() * 1000 + 50000;
      const high = open + Math.random() * 500;
      const low = open - Math.random() * 500;
      const close = Math.random() * 1000 + 50000;
      this.dataChart.unshift([startTimestamp, open, high, low, close]);
    }
    this.chartCandleOptions.series = [{ name: "candle", data: this.dataChart }];
    this.chartBarOptions.series = [{ name: "volume", data: this.dataChart }];
  }
  updateData() {
    this.delta = (Math.random() * 100 - 50).toFixed(2);

    const timestamp = new Date().getTime();
    const open = Math.random() * 1000 + 50000;
    const high = open + Math.random() * 500;
    const low = open - Math.random() * 500;
    const close = Math.random() * 1000 + 50000;
    this.dataChart.push([timestamp, open, high, low, close]);

    this.chartCandleOptions.series = [{ name: "candle", data: this.dataChart }];
    this.chartBarOptions.series = [{ name: "volume", data: this.dataChart }];

    if (close > open) {
      this.message = "Giá đang tăng, Nên bán ra";

    } else {
      this.message = "Giá đang giảm, Nên mua vào";
    }
    console.log(this.message);

  }
  message: string = '';
}

