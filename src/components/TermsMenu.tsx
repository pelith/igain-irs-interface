import React, { ReactElement } from 'react';
import { Box, Text, Flex, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useLocation, useHistory } from 'react-router';
import { IGainTerm } from '../constants/termInfo/iGainTermData';
import { ReactComponent as IconDownArrow } from '../assets/icon-down-arrow.svg';
import { ReactComponent as IconUpArrow } from '../assets/icon-arrow-up.svg';
import { PROTOCOL_DATA } from '../constants/termInfo/protocolType';
import { transformDate } from '../utils';
import CountDownInfo from './CountDownInfo';
import useWindowSize from '../hooks/useWindowSize';
import { ResponsiveView } from '../constants/responsive';

interface Props {
  terms?: IGainTerm[];
  setCurrentTermInfo: (input: IGainTerm) => void;
}
interface ListItemProps {
  term: IGainTerm;
  selectTerm: (term: IGainTerm) => void;
}

const TermListItem = ({ term, selectTerm }: ListItemProps) => {
  const Icon = PROTOCOL_DATA[term.protocolType].Icon;
  return (
    <Flex
      justify='space-between'
      alignItems='center'
      w={{ base: '351px', lg: '400px' }}
      h='72px'
      px='16px'
      onClick={() => {
        selectTerm(term);
      }}
    >
      <Flex alignItems='center'>
        <Box h='40px' w='40px' borderRadius='8px'>
          <Icon />
        </Box>
        <Text pl='1rem' fontSize='sm'>
          {transformDate(term.closeTime * 1000)}
        </Text>
      </Flex>
      <CountDownInfo countdownTime={term.closeTime * 1000} />
    </Flex>
  );
};

function TermsMenu({ terms, setCurrentTermInfo }: Props): ReactElement {
  let history = useHistory();
  const windowSize = useWindowSize();
  const location = useLocation();
  const currentPath = location.pathname;
  const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
  const selectTerm = (term: IGainTerm) => {
    setCurrentTermInfo(term);
    history.push(parentPath + '/' + term.address);
  };
  return (
    <Menu offset={windowSize === ResponsiveView.WEB ? [-200, 18] : [0, 18]} variant='termMenu'>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Button}
            px='0'
            width='24px'
            minWidth='unset'
            height='24px'
            bg='primary.700'
            color='primary.100'
            variant='iconBtn'
            _hover={{
              bg: 'primary.300',
              color: 'neutral',
            }}
            _active={{
              bg: 'primary.300',
              color: 'neutral',
            }}
          >
            <Flex justify='center' align='center'>
              {isOpen ? <IconUpArrow /> : <IconDownArrow />}
            </Flex>
          </MenuButton>
          <MenuList
            border='none'
            p='0'
            bg='primary.500'
            shadow='0px 24px 32px rgba(0, 0, 0, 0.12), 0px 16px 24px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.12), 0px 0px 1px rgba(0, 0, 0, 0.12)'
          >
            {terms?.map((element, index) => (
              <MenuItem key={index} p='0' bg='primary.500' _hover={{ bg: 'primary.300' }} borderRadius='0.5rem'>
                <TermListItem term={element} selectTerm={selectTerm} />
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
}

export default TermsMenu;
