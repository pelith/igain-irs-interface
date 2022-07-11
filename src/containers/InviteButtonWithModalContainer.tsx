import React, { ReactElement, useContext, useEffect } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import ReferralCodeRegisterModal from '../components/ReferralCodeRegisterModal';
import ShareReferralCodeModal from '../components/ShareReferralCodeModal';
import { ReferralCodeContext } from '../context/ReferralCodeContext';
import { Web3Context } from '../context/Web3Context';
import { useSetRegisterReferralCode } from '../hooks/useSetRegisterReferralCode';
import { BlockInteractionState } from '../constants/blockActionStatus';
import AuthNetworkCheckButtonContainer from './AuthNetworkCheckButtonContainer';
import { DEFAULT_CHAIN_ID } from '../constants/web3ContextConstants';

interface Props {
  buttonVariant?: string;
  buttonWidth?: string;
  buttonSize?: string;
  buttonColorScheme?: string;
}

function InviteButtonWithModalContainer({
  buttonVariant = 'primary',
  buttonWidth = '',
  buttonSize = 'sm',
  buttonColorScheme = '',
}: Props): ReactElement {
  const web3Controller = useContext(Web3Context);
  const { referralCode, isNeedRegister } = useContext(ReferralCodeContext);
  const { registerState, register } = useSetRegisterReferralCode(web3Controller);

  const registerModalRegisterModalController = useDisclosure();
  const shareReferralCodeModalController = useDisclosure();

  useEffect(() => {
    if (registerState === BlockInteractionState.SUCCESS && parseFloat(referralCode || '0') > 0) {
      shareReferralCodeModalController.onOpen();
      registerModalRegisterModalController.onClose();
    }
  }, [registerState, referralCode]);

  return (
    <Box>
      <AuthNetworkCheckButtonContainer
        targetNetwork={DEFAULT_CHAIN_ID}
        onClick={
          !isNeedRegister && referralCode
            ? shareReferralCodeModalController.onOpen
            : registerModalRegisterModalController.onOpen
        }
        isOriginText
        variant={buttonVariant}
        size={buttonSize}
        w={buttonWidth}
        colorScheme={buttonColorScheme}
      >
        Invite
      </AuthNetworkCheckButtonContainer>
      <ReferralCodeRegisterModal
        isOpen={registerModalRegisterModalController.isOpen}
        onClose={registerModalRegisterModalController.onClose}
        onClickRegister={register}
        registerState={registerState}
      />
      <ShareReferralCodeModal
        isOpen={shareReferralCodeModalController.isOpen}
        onClose={shareReferralCodeModalController.onClose}
        referralCode={referralCode}
      />
    </Box>
  );
}

export default InviteButtonWithModalContainer;
