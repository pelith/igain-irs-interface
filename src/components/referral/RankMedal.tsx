import { Box, Square, SquareProps } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import IronMedal from '../../assets/icon-medal-iron-large.svg';
import CopperMedal from '../../assets/icon-medal-copper-large.svg';
import SilverMedal from '../../assets/icon-medal-silver-large.svg';
import GoldMedal from '../../assets/icon-medal-gold-large.svg';

interface RankMedalProps extends SquareProps {
  rank: number;
}

const RankMedal = ({ rank, size }: RankMedalProps) => {
  const medalSvgUrl = useMemo(() => {
    if (rank === 1) {
      return GoldMedal;
    }
    if (rank === 2) {
      return SilverMedal;
    }
    if (rank === 3) {
      return CopperMedal;
    }
    return IronMedal;
  }, [rank]);

  return (
    <Square size={size} bgImage={`url(${medalSvgUrl})`} bgPosition='center' bgRepeat='no-repeat' bgSize='100% 100%'>
      <Box position='relative' top='-2px' fontStyle='normal' fontWeight='700' color='neutral'>
        {rank}
      </Box>
    </Square>
  );
};

export default RankMedal;
