import { FontWeightCell, MobileInviteesCell, MobileTxVolumeAndAddressCell, RankMedalCell } from './TableCells';

export const columns = [
  {
    Header: '',
    accessor: 'rank',
    Cell: RankMedalCell,
  },
  {
    Header: 'Referred Tx Volume',
    accessor: 'referredTxVolume', // accessor is the "key" in the data
    Cell: FontWeightCell,
  },
  {
    Header: 'Referred People',
    accessor: 'referredPeople',
  },
  {
    Header: 'Address',
    accessor: 'address',
  },
];

export const mobileColumns = [
  {
    Header: '',
    accessor: 'rank',
    Cell: RankMedalCell,
  },
  {
    Header: '',
    accessor: 'referredTxVolumeAndAddress', // accessor is the "key" in the data
    Cell: MobileTxVolumeAndAddressCell,
  },
  {
    Header: '',
    accessor: 'referredPeople',
    Cell: MobileInviteesCell,
  },
];
