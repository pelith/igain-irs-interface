import React, { useContext, ReactElement, useMemo } from 'react';
import { Flex } from '@chakra-ui/layout';
import { Web3Context } from '../../context/Web3Context';
import SideInfoBalanceItem from '../../components/portfolio/SideInfoBalanceItem';
import { useTokenBalances } from '../../hooks/useTokenBalances';
import { IGAIN_POSITION } from '../../constants/termInfo/positionTokenData';
import { formatAmount } from '../../utils';
import { SelectedChainContext } from '../../context/SelectedChainContext';

function SideInfoContainer(): ReactElement {
  const { selectedChain } = useContext(SelectedChainContext);
  const web3Controller = useContext(Web3Context);
  const { account } = web3Controller;
  const positionTokens = useMemo(
    () =>
      Object.values(IGAIN_POSITION[selectedChain])
        .map((token) => Object.values(token))
        .flat(),
    [selectedChain],
  );
  const positionTokenAddress = useMemo(() => positionTokens.map((token) => token.address), [positionTokens]);
  const positionTokenBalances = useTokenBalances(positionTokenAddress, account, web3Controller);

  return (
    <Flex direction={{ base: 'row', lg: 'column' }} flexWrap='wrap'>
      {positionTokenBalances?.map((balance, index) => {
        if (balance.lte(0)) {
          return null;
        }
        return (
          <SideInfoBalanceItem
            key={index}
            token={positionTokens[index].name}
            balance={formatAmount(balance, positionTokens[index].decimals || 18, 2)}
            Icon={positionTokens[index].icon}
          />
        );
      })}
    </Flex>
  );
}

export default SideInfoContainer;
