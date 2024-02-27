import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
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
  dataChart: any[] = [];
  interval: any;

  constructor(private cdr: ChangeDetectorRef) {
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
    this.interval = setInterval(() => {
      this.addData(); // Thêm dữ liệu mới mỗi 500 milliseconds
    }, 500);
  }

  ngOnDestroy() {
    clearInterval(this.interval); // Xoá interval khi component bị hủy
  }

  addData() {
    // const timestamp = new Date().getTime();
    // const open = Math.random() * 10000 + 50000;
    // const high = open + Math.random() * 500;
    // const low = open - Math.random() * 500;
    // const close = Math.random() * 1000 + 50000;
    // this.dataChart.push([timestamp, open, high, low, close]);
    this.chartCandleOptions.series = [{ data: this.dataChart }];
    this.chartBarOptions.series = [{ data: this.dataChart }];
    this.cdr.detectChanges(); // Cập nhật dữ liệu trên UI
  }
}
