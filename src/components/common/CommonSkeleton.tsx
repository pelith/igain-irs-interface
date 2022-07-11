import { Skeleton } from '@chakra-ui/react';
import React, { ReactElement } from 'react';

interface Props {
  children: React.ReactNode;
  isLoaded: boolean;
  minW?: string;
}

function CommonSkeleton({ children, isLoaded, minW }: Props): ReactElement {
  return (
    <Skeleton
      isLoaded={isLoaded}
      w='fit-content'
      minW={minW || '60px'}
      h='fit-content'
      startColor='rgba(23, 32, 61, 1)'
      endColor='rgba(36, 50, 89, 1)'
      speed={0.4}
    >
      {children}
    </Skeleton>
  );
}

export default CommonSkeleton;
