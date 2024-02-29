import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5stock from '@amcharts/amcharts5/stock';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';

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
  dataSubscription: any;
  firstDate: any = new Date();
  value: number = 1200;
  constructor(private http: HttpClient) { }

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

  ngOnInit() {
    let root = am5.Root.new("chartdiv");

    const myTheme = am5.Theme.new(root);

    myTheme.rule("Grid", ["scrollbar", "minor"]).setAll({
      visible: false
    });

    root.setThemes([
      am5themes_Animated.new(root),
      myTheme
    ]);

    // Create a stock chart
    let stockChart = root.container.children.push(am5stock.StockChart.new(root, {
      paddingRight: 0
    }));


    // Set global number format
    root.numberFormatter.set("numberFormat", "#,###.00");


    // Create a main stock panel (chart)
    let mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
      wheelY: "zoomX",
      panX: true,
      panY: true
    }));


    // Create value axis
    let valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom"
      }),
      extraMin: 0.5, // adds some space for for main series
      tooltip: am5.Tooltip.new(root, {}),
      numberFormat: "#,###.00",
      extraTooltipPrecision: 2
    }));

    let dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "minute",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        pan: "zoom",
        minorGridEnabled: true
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    let currentValueDataItem = valueAxis.createAxisRange(valueAxis.makeDataItem({ value: 0 }));
    let currentLabel = currentValueDataItem.get("label");
    if (currentLabel) {
      currentLabel.setAll({
        fill: am5.color(0xffffff),
        background: am5.Rectangle.new(root, { fill: am5.color(0x000000) })
      })
    }

    let currentGrid = currentValueDataItem.get("grid");
    if (currentGrid) {
      currentGrid.setAll({ strokeOpacity: 0.5, strokeDasharray: [2, 5] });
    }
    // Add series
    let valueSeries = mainPanel.series.push(am5xy.CandlestickSeries.new(root, {
      name: "AMCH",
      clustered: false,
      valueXField: "Date",
      valueYField: "Close",
      highValueYField: "High",
      lowValueYField: "Low",
      openValueYField: "Open",
      calculateAggregates: true,
      xAxis: dateAxis,
      yAxis: valueAxis,
      legendValueText: "open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]",
      legendRangeValueText: ""
    }));


    // Set main value series
    stockChart.set("stockSeries", valueSeries);


    // Add a stock legend
    let valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
      stockChart: stockChart
    }));


    // Create volume axis
    let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {});

    volumeAxisRenderer.labels.template.set("forceHidden", true);
    volumeAxisRenderer.grid.template.set("forceHidden", true);

    let volumeValueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
      numberFormat: "#.##a",
      height: am5.percent(20),
      y: am5.percent(100),
      centerY: am5.percent(100),
      renderer: volumeAxisRenderer
    }));

    // Add series
    let volumeSeries = mainPanel.series.push(am5xy.ColumnSeries.new(root, {
      name: "Volume",
      clustered: false,
      valueXField: "Date",
      valueYField: "Volume",
      xAxis: dateAxis,
      yAxis: volumeValueAxis,
      legendValueText: "[bold]{valueY.formatNumber('#,###.000a')}[/]"
    }));

    volumeSeries.columns.template.setAll({
      strokeOpacity: 0,
      fillOpacity: 0.5
    });

    // color columns by stock rules
    volumeSeries.columns.template.adapters.add("fill", function (fill, target) {
      let dataItem = target.dataItem;
      if (dataItem) {
        return stockChart.getVolumeColor(dataItem);
      }
      return fill;
    })


    // Set main series

    stockChart.set("volumeSeries", volumeSeries);
    valueLegend.data.setAll([valueSeries, volumeSeries]);


    // Add cursor(s)

    mainPanel.set("cursor", am5xy.XYCursor.new(root, {
      yAxis: valueAxis,
      xAxis: dateAxis,
      snapToSeries: [valueSeries],
      snapToSeriesBy: "y!"
    }));


    // Add scrollbar

    let scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50
    }));
    stockChart.toolsContainer.children.push(scrollbar);

    let sbDateAxis = scrollbar.chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "minute",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true
      })
    }));

    let sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    let sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
      valueYField: "Close",
      valueXField: "Date",
      xAxis: sbDateAxis,
      yAxis: sbValueAxis
    }));

    sbSeries.fills.template.setAll({
      visible: true,
      fillOpacity: 0.3
    });

    // Set up series type switcher

    let seriesSwitcher = am5stock.SeriesTypeControl.new(root, {
      stockChart: stockChart
    });

    seriesSwitcher.events.on("selected", function (ev) {
      if (ev.item instanceof Object && 'id' in ev.item) {
        setSeriesType(ev.item.id);
      }
    });

    function getNewSettings(series) {
      let newSettings = [];
      am5.array.each(["name", "valueYField", "highValueYField", "lowValueYField", "openValueYField", "calculateAggregates", "valueXField", "xAxis", "yAxis", "legendValueText", "stroke", "fill"], function (setting) {
        newSettings[setting] = series.get(setting);
      });
      return newSettings;
    }

    function setSeriesType(seriesType) {
      // Get current series and its settings
      let currentSeries = stockChart.get("stockSeries");
      let newSettings = getNewSettings(currentSeries);

      // Remove previous series
      let data = currentSeries.data.values;
      mainPanel.series.removeValue(currentSeries);

      // Create new series
      let series;
      switch (seriesType) {
        case "line":
          series = mainPanel.series.push(am5xy.LineSeries.new(root, newSettings));
          break;
        case "candlestick":
        case "procandlestick":
          // newSettings.series .clustered = false;
          series = mainPanel.series.push(am5xy.CandlestickSeries.new(root, newSettings));
          if (seriesType == "procandlestick") {
            series.columns.template.get("themeTags").push("pro");
          }
          break;
        case "ohlc":
          // newSettings.clustered = false;
          series = mainPanel.series.push(am5xy.OHLCSeries.new(root, newSettings));
          break;
      }

      // Set new series as stockSeries
      if (series) {
        valueLegend.data.removeValue(currentSeries);
        series.data.setAll(data);
        stockChart.set("stockSeries", series);
        let cursor = mainPanel.get("cursor");
        if (cursor) {
          cursor.set("snapToSeries", [series]);
        }
        valueLegend.data.insertIndex(0, series);
        if ('clustered' in series) {
          series.clustered = false;
        }
      }
    }


    // Stock toolbar
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock/toolbar/
    let toolbar = am5stock.StockToolbar.new(root, {
      container: document.getElementById("chartcontrols"),
      stockChart: stockChart,
      controls: [

        am5stock.IndicatorControl.new(root, {
          stockChart: stockChart,
          legend: valueLegend
        }),
        am5stock.DateRangeSelector.new(root, {
          stockChart: stockChart
        }),
        am5stock.PeriodSelector.new(root, {
          stockChart: stockChart
        }),
        // intervalSwitcher,
        seriesSwitcher,
        am5stock.DrawingControl.new(root, {
          stockChart: stockChart
        }),
        am5stock.ResetControl.new(root, {
          stockChart: stockChart
        }),
        am5stock.SettingsControl.new(root, {
          stockChart: stockChart
        })
      ]
    })

    // data
    let data = this.generateChartData(this.firstDate, this.value);

    // set data to all series
    valueSeries.data.setAll(data);
    volumeSeries.data.setAll(data);
    sbSeries.data.setAll(data);
    this.dataSubscription = interval(1000).subscribe(() => {
      let lastDataObject: any = valueSeries.data.getIndex(valueSeries.data.length - 1);

      if (lastDataObject) {
        let previousDate = lastDataObject.Date;
        let previousValue = lastDataObject.Close;

        this.value = am5.math.round(previousValue + (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2, 2);

        let high = lastDataObject.High;
        let low = lastDataObject.Low;
        let open = lastDataObject.Open;
        let volume = lastDataObject.Volume;
        // console.log(volume);

        if (am5.time.checkChange(Date.now(), previousDate, "minute")) {
          open = this.value;
          high = this.value;
          low = this.value;
          volume = this.value;
          // console.log('newdata', volume);

          let dObj1 = {
            Date: Date.now(),
            Close: this.value,
            Open: this.value,
            Low: this.value,
            High: this.value,
            Volume: this.value
          };

          valueSeries.data.push(dObj1);
          volumeSeries.data.push(dObj1);
          sbSeries.data.push(dObj1);
        } else {
          if (this.value > high) {
            high = this.value;
          }

          if (this.value < low) {
            low = this.value;
          }

          let dObj2: any = {
            Date: Date.now(),
            Close: this.value,
            Open: open,
            Low: low,
            High: high,
            Volume: volume
          };
          // console.log('volume', dObj2.Volume);
          

          valueSeries.data.setIndex(valueSeries.data.length - 1, dObj2);
          volumeSeries.data.setIndex(valueSeries.data.length - 1, dObj2);
          sbSeries.data.setIndex(sbSeries.data.length - 1, dObj2);
        }
        // console.log('Volume Series:', this.dataSubscription.Volume);

        if (currentLabel) {
          currentValueDataItem.animate({ key: "value", to: this.value, duration: 500, easing: am5.ease.out(am5.ease.cubic) });
          currentLabel.set("text", stockChart.getNumberFormatter().format(this.value));
          let bg = currentLabel.get("background");
          if (bg) {
            if (this.value < open) {
              bg.set("fill", root.interfaceColors.get("negative"));
            }
            else {
              bg.set("fill", root.interfaceColors.get("positive"));
            }
          }
        }
      }
    });


    
  }
  generateChartData(firstDate: Date, value: number) {
    let chartData = [];

    for (var i = 0; i < 50; i++) {
      let newDate = new Date(firstDate);
      newDate.setMinutes(newDate.getMinutes() - i);

      value += Math.round((Math.random() < 0.49 ? 1 : -1) * Math.random() * 10);

      let open = value + Math.round(Math.random() * 16 - 8);
      let low = Math.min(value, open) - Math.round(Math.random() * 5);
      let high = Math.max(value, open) + Math.round(Math.random() * 5);
      let volume = Math.round(Math.random() * 10000);
      chartData.unshift({
        Date: newDate.getTime(),
        Close: value,
        Open: open,
        Low: low,
        High: high,
        Volume: volume
      });


    }
    console.log(chartData);

    return chartData;

  }

}