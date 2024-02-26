import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { TradingviewWidgetModule } from 'angular-tradingview-widget';
declare const TradingView: any;
export enum BarStyles {
  BARS = '0',
  CANDLES = '1',
  HOLLOW_CANDLES = '9',
  HEIKIN_ASHI = '8',
  LINE = '2',
  AREA = '3',
  RENKO = '4',
  LINE_BREAK = '7',
  KAGI = '5',
  POINT_AND_FIGURE = '6'
}

export enum IntervalTypes {
  D = 'D',
  W = 'W'
};

export enum RangeTypes {
  YTD = 'ytd',
  ALL = 'all'
};

export enum Themes {
  LIGHT = 'Light',
  DARK = 'Dark'
};



export const SCRIPT_ID = 'tradingview-widget-script';
export const CONTAINER_ID = `tradingview-widget-${Math.random()}`;

export interface ITradingViewWidget {
  allow_symbol_change?: boolean;
  autosize?: boolean;
  calendar?: boolean;
  details?: boolean;
  enable_publishing?: boolean;
  height?: number | string;
  hideideas?: boolean;
  hide_legend?: boolean;
  hide_side_toolbar?: boolean;
  hide_top_toolbar?: boolean;
  hotlist?: boolean;
  interval?:
  '1' |
  '3' |
  '5' |
  '15' |
  '30' |
  '60' |
  '120' |
  '180' |
  IntervalTypes.D |
  IntervalTypes.W;
  locale?: string;
  news?: string[];
  no_referral_id?: boolean;
  popup_height?: number | string;
  popup_width?: number | string;
  referral_id?: string;
  range?:
  '1d' |
  '5d' |
  '1m' |
  '3m' |
  '6m' |
  RangeTypes.YTD |
  '12m' |
  '60m' |
  RangeTypes.ALL;
  save_image?: boolean;
  show_popup_button?: boolean;
  studies?: string[];
  style?: BarStyles.BARS |
  BarStyles.CANDLES |
  BarStyles.HOLLOW_CANDLES |
  BarStyles.HEIKIN_ASHI |
  BarStyles.LINE |
  BarStyles.AREA |
  BarStyles.RENKO |
  BarStyles.LINE_BREAK |
  BarStyles.KAGI |
  BarStyles.POINT_AND_FIGURE;
  symbol: string;
  theme?: Themes.LIGHT | Themes.DARK;
  timezone?: string;
  toolbar_bg?: string;
  watchlist?: string[];
  widgetType: string;
  width?: number | string;
  withdateranges?: boolean;
}
@Component({
  selector: 'app-tv-chart',
  templateUrl: './tv-chart.component.html',
  styleUrls: ['./tv-chart.component.scss'],
  standalone: true,
  imports: [TradingviewWidgetModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TvChartComponent implements OnInit {
  private _widgetConfig!: ITradingViewWidget;
  private _defaultConfig: ITradingViewWidget = {
    symbol: 'BITSTAMP:BTCUSD',
    allow_symbol_change: true,
    autosize: true,
    enable_publishing: false,
    height: 810,
    hideideas: true,
    hide_legend: false,
    hide_side_toolbar: false,
    hide_top_toolbar: false,
    interval: IntervalTypes.D,

    locale: 'en',
    save_image: true,
    show_popup_button: true,
    style: BarStyles.CANDLES,
    theme: Themes.LIGHT,
    timezone: 'Etc/UTC',
    toolbar_bg: '#F1F3F6',
    widgetType: 'widget',
    // width: 980,
    details: true,
    hotlist: true,
    calendar: true,
    withdateranges: true,
    watchlist: [
      "BITSTAMP:BTCUSD"
    ],
  };

  style: {} = {};
  containerId = CONTAINER_ID;

  @Input('widgetConfig') set widgetConfig(value: ITradingViewWidget) {
    this._widgetConfig = value;
    this.cleanWidget();
    this.initWidget();
  }

  get widgetConfig(): ITradingViewWidget {
    return this._widgetConfig || this._defaultConfig;
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.appendScript(this.initWidget.bind(this));
  }

  initWidget() {
    /* global TradingView */
    if (typeof TradingView === 'undefined' || !this.getContainer()) return;

    const { widgetType, ...widgetConfig } = this.widgetConfig;
    const config = { ...widgetConfig, container_id: this.containerId };

    if (config.autosize) {
      delete config.width;
      delete config.height;
    }


    if (config.popup_width && typeof config.popup_width === 'number') {
      config.popup_width = config.popup_width.toString();
    }

    if (config.popup_height && typeof config.popup_height === 'number') {
      config.popup_height = config.popup_height.toString();
    }

    if (config.autosize) {
      this.style = {
        width: '100%',
        height: '100%'
      };
    }
    /* global TradingView */
    if (!!widgetType)
      new TradingView[widgetType](config);
    else
      console.error(`Can not create "TradingView", because "widgetType" is missing`)
  };

  appendScript(onload: (() => any)) {
    if (!this.canUseDOM()) {
      onload();
      return;
    }

    if (this.scriptExists()) {
      /* global TradingView */
      if (typeof TradingView === 'undefined') {
        this.updateOnloadListener(onload);
        return;
      }
      onload();
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/tv.js';
    script.onload = onload;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  canUseDOM() {
    return typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement
  }

  scriptExists() {
    return this.getScriptElement() !== null;
  }

  updateOnloadListener(onload: (() => any)) {
    const script = this.getScriptElement() || {} as any;
    const oldOnload = script.onload.bind(this);
    return script.onload = () => {
      oldOnload();
      onload();
    };
  };

  getScriptElement() {
    return document.getElementById(SCRIPT_ID);
  }

  cleanWidget() {
    if (!this.canUseDOM()) return;
    const container = this.getContainer();
    if (container) {
      container.innerHTML = '';
    }
  };

  getContainer() {
    return document.getElementById(this.containerId);
  }

}
