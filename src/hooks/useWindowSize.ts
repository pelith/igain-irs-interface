import { useBreakpointValue } from '@chakra-ui/react';
import { ResponsiveView } from '../constants/responsive';

function useWindowSize(): ResponsiveView | undefined {
  const windowSize = useBreakpointValue({ base: ResponsiveView.MOBILE, lg: ResponsiveView.WEB });
  return windowSize;
}

export default useWindowSize;
