import { Button, Flex, Text } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { Link as ReachLink } from 'react-router-dom';
import { INTERNAL_PATH } from '../constants/links';
import { ReactComponent as IconRedeem } from '../assets/icon-redeem.svg';
import { ReactComponent as IconArrowRight } from '../assets/icon-arrow-right.svg';

interface Props {
  descriptionContent: string;
  buttonContent: string;
  // link: string;
}

function TermExpiredContent({ descriptionContent, buttonContent }: Props): ReactElement {
  return (
    <Flex
      direction='column'
      alignItems='center'
      bgColor='primary.700'
      pt='126.8px'
      pb='118px'
      borderRadius='0.5rem'
      width='100%'
    >
      <IconRedeem />
      <Text pt='25px' pb='32px' fontSize='sm'>
        {descriptionContent}
      </Text>
      <Button as={ReachLink} to={INTERNAL_PATH.PORTFOLIO} size='lg' variant='primary' colorScheme='secondary'>
        <Flex align='center'>
          <Text pr='13px'>{buttonContent}</Text>
          <IconArrowRight width='14px' height='11px' />
        </Flex>
      </Button>
    </Flex>
  );
}

export default TermExpiredContent;
