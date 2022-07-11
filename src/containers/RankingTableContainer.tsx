import React, { useMemo } from 'react';
import useSWR from 'swr';
import RankingTable from '../components/rankingTable/RankingTable';
import { shortenAddress } from '../utils/web3Utils';
import { jsonFetcher } from '../utils/fetch';

function RankingTableContainer() {
  const { data: rank } = useSWR(`${process.env.REACT_APP_CHART_API}/referral_rank`, jsonFetcher);
  const rankData = useMemo(
    () =>
      !rank
        ? []
        : rank.map((player: any) => {
            return {
              ...player,
              address: shortenAddress(player.address),
              referredTxVolumeAndAddress: [player.referredTxVolume, shortenAddress(player.address)],
            };
          }),
    [rank],
  );
  return <RankingTable data={rankData} />;
}

export default RankingTableContainer;
