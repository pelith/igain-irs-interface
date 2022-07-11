import { Button } from '@chakra-ui/react';
import { Link as ReachLink, useLocation } from 'react-router-dom';
import React, { ReactElement } from 'react';

interface Props {
  linkPath: string;
  linkName: string;
  variant?: string;
}

function HeaderLink({ linkPath, linkName, variant }: Props): ReactElement {
  const location = useLocation();
  const isActive = location.pathname.includes(linkPath);
  return (
    <Button
      as={ReachLink}
      to={linkPath}
      variant={!variant ? 'headerLink' : variant}
      size='sm'
      fontSize='sm'
      color={isActive ? 'neural' : undefined}
      isActive={isActive}
    >
      {linkName}
    </Button>
  );
}

export default HeaderLink;
