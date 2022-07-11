import { INTERNAL_PATH } from '../../constants/links';

import {
  ProxyIconCell,
  BaseTokenCell,
  ExpiryCell,
  MarkPriceCell,
  BalanceCell,
  TableBtnCell,
  FarmingCell,
  MarkApyCell,
  TotalApyCell,
  VolumeCell,
} from './TableCells';

function compareNumericString(rowA: any, rowB: any, id: any, desc: any) {
  let a = Number.parseFloat(rowA.values[id]);
  let b = Number.parseFloat(rowB.values[id]);
  if (Number.isNaN(a)) {
    // Blanks and non-numeric strings to bottom
    a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (Number.isNaN(b)) {
    b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

function compareApyObj(rowA: any, rowB: any, id: any, desc: any) {
  let a = Number.parseFloat(rowA.values[id].apy);
  let b = Number.parseFloat(rowB.values[id].apy);
  if (Number.isNaN(a)) {
    // Blanks and non-numeric strings to bottom
    a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (Number.isNaN(b)) {
    b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

const tradePageColumns = [
  {
    Header: '',
    accessor: 'proxyIcon',
    Cell: ProxyIconCell,
    disableSortBy: true,
  },
  {
    Header: 'Asset',
    accessor: 'baseToken',
    Cell: BaseTokenCell,
    disableSortBy: true,
  },
  {
    Header: 'Expiry',
    accessor: 'expiryTime',
    Cell: ExpiryCell,
  },
  {
    Header: 'Mark APY',
    accessor: 'markApy',
    Cell: MarkApyCell,
    sortType: compareApyObj,
  },
  {
    Header: 'Mark Price',
    accessor: 'markPrice',
    Cell: MarkPriceCell,
    disableSortBy: true,
  },
  {
    Header: 'Leverage',
    accessor: 'leverage',
  },
  {
    Header: 'Balance',
    accessor: 'balance',
    Cell: BalanceCell,
    disableSortBy: true,
  },
  {
    id: 'rowBtn',
    accessor: 'detailPath',
    Cell: TableBtnCell,
    disableSortBy: true,
  },
];

const poolPageColumns = [
  {
    Header: '',
    accessor: 'proxyIcon',
    Cell: ProxyIconCell,
    disableSortBy: true,
  },
  {
    Header: 'Asset',
    accessor: 'baseToken',
    Cell: BaseTokenCell,
    disableSortBy: true,
  },
  {
    Header: 'Expiry',
    accessor: 'expiryTime',
    Cell: ExpiryCell,
  },
  {
    Header: 'APY',
    accessor: 'apy',
    sortType: compareNumericString,
    Cell: TotalApyCell,
  },
  {
    Header: 'Volume (7d)',
    accessor: 'volume',
    disableSortBy: true,
    Cell: VolumeCell,
  },
  {
    Header: 'Farming',
    accessor: 'farmingAddress',
    Cell: FarmingCell,
    disableSortBy: true,
  },
  {
    Header: 'Balance',
    accessor: 'balance',
    disableSortBy: true,
  },
  {
    id: 'rowBtn',
    accessor: 'detailPath',
    Cell: TableBtnCell,
    disableSortBy: true,
  },
];

const TABLE_COLUMNS = {
  [INTERNAL_PATH.TRADE]: tradePageColumns,
  [INTERNAL_PATH.POOL]: poolPageColumns,
};

export default TABLE_COLUMNS;
