import React, { ReactElement } from 'react';
import { Button, ButtonProps } from '@chakra-ui/button';

function MainButton({ children, ...buttonProps }: ButtonProps): ReactElement {
  return (
    <Button w='100%' size='lg' variant='primary' {...buttonProps}>
      {children}
    </Button>
  );
}

export default MainButton;
