import { ChangeDetectorRef, Component, OnInit } from '@angular/core';


// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-amchart',
  templateUrl: './amchart.component.html',
  styleUrls: ['./amchart.component.scss'],
  standalone: true,
  imports: []
})
export class AmchartComponent implements OnInit {
  private BASE_URL: string = `https://min-api.cryptocompare.com/data`
  private API_KEY: string = 'e26ca12fcad2c55de5cd9620fb875261c509ead99ecfeb2cfd595f1340d39e48'
  chartData: any[]
  chart: any;
  series: any;
  sbseries: any;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }
  fetchOHLC(): void {
    const url = `${this.BASE_URL}/histohlc?fsym=BTC&tsym=USD&limit=1000&api_key=${this.API_KEY}`
    this.http.get(url).subscribe({
      next: (data: any) => {
        console.log('data', data)
      },
      error: err => {
        console.log(err)
      }
    })

  }
  ngOnInit(): void {
    const root = am5.Root.new('chartdiv');
    const myTheme = am5.Theme.new(root);
    myTheme.rule('Grid', ['minor', 'scrollbar']).setAll({
      visible: false
    });
    root.setThemes([
      am5themes_Animated.new(root),
      myTheme
    ]);
    let data = this.generateChartData();

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: true,
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        paddingLeft: 0
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        groupData: true,
        baseInterval: { timeUnit: 'day', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          pan: 'zoom',
          minorGridEnabled: true
        })
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, { pan: 'zoom' })
      })
    );

    let color = root.interfaceColors.get('background');

    let series = chart.series.push(
      am5xy.CandlestickSeries.new(root, {
        fill: color,
        calculateAggregates: true,
        stroke: color,
        name: 'MDXI',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'close',
        openValueYField: 'open',
        lowValueYField: 'low',
        highValueYField: 'high',
        valueXField: 'date',
        lowValueYGrouped: 'low',
        highValueYGrouped: 'high',
        openValueYGrouped: 'open',
        valueYGrouped: 'close',
        legendValueText: 'open: {openValueY} low: {lowValueY} high: {highValueY} close: {valueY}',
        legendRangeValueText: '{valueYClose}'
      })
    );

    series.columns.template.get('themeTags').push('pro');

    let cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        xAxis: xAxis
      })
    );
    cursor.lineY.set('visible', false);

    chart.leftAxesContainer.set('layout', root.verticalLayout);

    let scrollbar = am5xy.XYChartScrollbar.new(root, {
      orientation: 'horizontal',
      height: 50
    });
    chart.set('scrollbarX', scrollbar);

    let sbxAxis = scrollbar.chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        groupData: true,
        groupIntervals: [{ timeUnit: 'week', count: 1 }],
        baseInterval: { timeUnit: 'day', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          opposite: false,
          strokeOpacity: 0,
          minorGridEnabled: true
        })
      })
    );

    let sbyAxis = scrollbar.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    let sbseries = scrollbar.chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: sbxAxis,
        yAxis: sbyAxis,
        valueYField: 'close',
        valueXField: 'date'
      })
    );

    let legend = yAxis.axisHeader.children.push(am5.Legend.new(root, {}));

    legend.data.push(series);

    legend.markers.template.setAll({
      width: 10
    });

    legend.markerRectangles.template.setAll({
      cornerRadiusTR: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusBL: 0
    });

    sbseries.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);

  }
  generateChartData() {
    let chartData = [];
    let firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 1000);
    firstDate.setHours(0, 0, 0, 0);
    let close = 1200;
    for (let i = 0; i < 1000; i++) {
      let newDate = new Date(firstDate);
      newDate.setDate(newDate.getDate() + i);

      close += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      let open = close + Math.round(Math.random() * 16 - 7);
      let low = Math.min(close, open) - Math.round(Math.random() * 5);
      let high = Math.max(close, open) + Math.round(Math.random() * 5);

      chartData.push({
        date: newDate.getTime(),
        close: close,
        open: open,
        low: low,
        high: high
      });
    }
    console.log('chartData', chartData);

    // setInterval(() => {
    //   this.addNewData();
    //   console.log(this.chartData);


    // }, 5000);
    return chartData;
  }

  addNewData() {
    let lastDataPoint = this.chartData[this.chartData.length - 1];
    let newDate = new Date(lastDataPoint.date);
    newDate.setMinutes(newDate.getMinutes() + 5);

    let close = lastDataPoint.close + Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    let open = close + Math.round(Math.random() * 16 - 7);
    let low = Math.min(close, open) - Math.round(Math.random() * 5);
    let high = Math.max(close, open) + Math.round(Math.random() * 5);

    this.chartData.push({
      date: newDate.getTime(),
      close: close,
      open: open,
      low: low,
      high: high
    });

    this.series.data.setAll(this.chartData);
    this.sbseries.data.setAll(this.chartData);
    this.cdr.detectChanges();
  }
}
