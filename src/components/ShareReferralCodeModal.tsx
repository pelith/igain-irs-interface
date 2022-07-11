import React, { useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Divider,
  Text,
  Flex,
  Link,
  Button,
  Box,
  useClipboard,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { ReactComponent as IconLink } from '../assets/icon-link.svg';
import { EXTERNAL_LINKS, INTERNAL_PATH } from '../constants/links';
import { ReactComponent as IconTwitter } from '../assets/icon-twitter.svg';
import { ReactComponent as IconTelegram } from '../assets/icon-telegram.svg';
import { ReactComponent as IconEmail } from '../assets/icon-email.svg';
import { ReactComponent as IconReddit } from '../assets/icon-reddit.svg';
import { ReactComponent as IconFacebook } from '../assets/icon-facebook.svg';
import { ReactComponent as IconCopy } from '../assets/icon-copy.svg';
import { INVITE_CODE_URL_PARAMS_KEY } from '../constants';

enum SocialMediaShareType {
  TWITTER = 'twitter',
  TELEGRAM = 'telegram',
  REDDIT = 'reddit',
  MAIL = 'email',
  FACE_BOOK = 'facebook',
}

interface SocialMediaBtnProps {
  children: React.ReactNode;
  shareBy: SocialMediaShareType;
  shareLink?: string;
  shareContent?: string;
  shareSubject?: string;
}

const SocialMediaBtn = ({
  children,
  shareBy,
  shareLink = EXTERNAL_LINKS.IGAIN_ECOSYSTEM,
  shareContent = 'Hey frens! I invite you to earn rewards on your stablecoins with iGain IRS! 🤝 ',
  shareSubject = 'I invite you to earn rewards on your stablecoins with iGain IRS! 🤝',
}: SocialMediaBtnProps) => {
  const postUrl = useMemo(() => {
    switch (shareBy) {
      case SocialMediaShareType.TWITTER: {
        return `https://twitter.com/intent/tweet?url=${shareLink}&text=${shareContent}`;
      }
      case SocialMediaShareType.TELEGRAM: {
        return `https://telegram.me/share/?url=${shareLink}&text=${shareContent}`;
      }
      case SocialMediaShareType.REDDIT: {
        return `https://www.reddit.com/submit?url=${shareLink}&title=${shareSubject}`;
      }
      case SocialMediaShareType.MAIL: {
        return `mailto:?body=${shareContent} ${shareLink}&subject=${shareSubject}`;
      }
      case SocialMediaShareType.FACE_BOOK: {
        return `https://www.facebook.com/sharer/sharer.php?u=${shareLink}&quote=${shareContent}`;
      }
      default: {
        break;
      }
    }
  }, [shareBy, shareLink, shareContent, shareSubject]);

  return (
    <Link href={postUrl} isExternal>
      <Button variant='iconBtn' colorScheme='socialMedia' size='iconBtnLg'>
        {children}
      </Button>
    </Link>
  );
};

interface ShareReferralCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

const ShareReferralCodeModal = ({ isOpen, onClose, referralCode }: ShareReferralCodeModalProps) => {
  const referralCodeFullUrl = useMemo(() => {
    const referralCodeUrl = new URL(`${window.location.origin}${process.env.PUBLIC_URL}${INTERNAL_PATH.FIX_INTEREST}`);
    if (referralCode) {
      referralCodeUrl.searchParams.append(INVITE_CODE_URL_PARAMS_KEY, referralCode);
    }
    return referralCodeUrl;
  }, [referralCode]);

  const { onCopy } = useClipboard(referralCodeFullUrl?.toString() || '');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ base: '343px', lg: '360px' }} bg='primary.500' fontSize='sm' color='primary.100'>
        <ModalHeader fontWeight='700' fontSize='sm'>
          Invite
        </ModalHeader>
        <ModalCloseButton color='primary.100' _focus={{ boxShadow: 'none' }} />
        <Divider borderWidth='2px' borderColor='primary.700' />
        <ModalBody p='1rem 1rem 1.5rem 1rem'>
          <Flex px='0.5rem' justify='space-between' align='center'>
            <Text fontSize='xs'>Your invitation link</Text>
            {/* TODO: link is not ready */}
            <Link
              mb='0.5rem'
              display='inline-block'
              href={EXTERNAL_LINKS.IGAIN_IRS_ARTICLE_ABOUT_REFERRAL_CODE}
              isExternal
              variant='secondary'
            >
              <Flex align='center'>
                <Text pr='4px'>Detail</Text>
                <IconLink width='20px' />
              </Flex>
            </Link>
          </Flex>
          <Flex p='12px' align='center' bg='primary.700' borderRadius='8px'>
            <Text color='neutral'>{referralCodeFullUrl.toString()}</Text>
            <Button
              onClick={() => {
                onCopy();
                toast.success('Copied!');
              }}
              bg='primary.500'
              p='9.5px 10px'
              _hover={{ bg: 'primary.300' }}
            >
              <Box>
                <IconCopy fontSize='20px' />
              </Box>
            </Button>
          </Flex>
          <Box px='0.5rem'>
            <Text mt='1.5rem' mb='1rem' fontSize='xs'>
              Share by
            </Text>
            <Flex justify='space-between' mb=''>
              <SocialMediaBtn shareBy={SocialMediaShareType.TWITTER} shareLink={referralCodeFullUrl.toString()}>
                <IconTwitter />
              </SocialMediaBtn>
              <SocialMediaBtn shareBy={SocialMediaShareType.TELEGRAM} shareLink={referralCodeFullUrl.toString()}>
                <IconTelegram />
              </SocialMediaBtn>
              <SocialMediaBtn shareBy={SocialMediaShareType.REDDIT} shareLink={referralCodeFullUrl.toString()}>
                <IconReddit />
              </SocialMediaBtn>
              <SocialMediaBtn shareBy={SocialMediaShareType.MAIL} shareLink={referralCodeFullUrl.toString()}>
                <IconEmail />
              </SocialMediaBtn>
              <SocialMediaBtn shareBy={SocialMediaShareType.FACE_BOOK} shareLink={referralCodeFullUrl.toString()}>
                <IconFacebook />
              </SocialMediaBtn>
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareReferralCodeModal;
