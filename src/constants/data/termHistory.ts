export interface ApyChartDataType {
  timestamp: number;
  markApy: number;
  indexApy: number;
}

export interface PriceChartDataType {
  timestamp: number;
  markPrice: number;
  indexPrice: number;
}

export interface TermHistoryChartDataType extends PriceChartDataType, ApyChartDataType {}
