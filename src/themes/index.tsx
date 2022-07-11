import React from 'react';
import '@fontsource/montserrat/400.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

type Dict = Record<string, any>;

function variantIconBtn(props: Dict) {
  const { colorScheme: c } = props;
  const extraColorAttribute: any = { _disabled: { bg: 'primary.500' } };
  switch (c) {
    case 'accent':
      extraColorAttribute.bg = 'accent.500';
      extraColorAttribute.color = 'neutral';
      extraColorAttribute._hover = { bg: 'accent.300' };
      break;
    case 'secondary':
      extraColorAttribute.bg = 'secondary.500';
      extraColorAttribute.color = 'neutral';
      extraColorAttribute._hover = { bg: 'secondary.300' };
      break;
    case 'socialMedia':
      extraColorAttribute.bg = 'primary.300';
      extraColorAttribute.color = 'primary.100';
      extraColorAttribute._hover = { bg: 'primary.100' };
      break;

    default:
      break;
  }
  return {
    p: '0.5rem',
    color: extraColorAttribute.color || 'primary.100',
    fontSize: '1rem',
    bg: extraColorAttribute.bg,
    _hover: {
      color: 'neutral',
      ...extraColorAttribute?._hover,
    },
    _active: {
      color: 'neutral',
    },
    _disabled: extraColorAttribute?._disabled,
  };
}

function variantPrimaryBtn(props: Dict) {
  const { colorScheme: c } = props;
  const extraColorAttribute: any = { _disabled: { bg: 'primary.500' } };
  switch (c) {
    case 'secondary':
      extraColorAttribute.bg = 'secondary.500';
      extraColorAttribute.color = 'neutral';
      extraColorAttribute._hover = { bg: 'secondary.300' };
      break;
    case 'common':
      extraColorAttribute.bg = 'primary.300';
      extraColorAttribute.color = 'neutral';
      extraColorAttribute._hover = { bg: 'primary.100' };
      break;

    case 'accent':
    default:
      extraColorAttribute.bg = 'accent.500';
      extraColorAttribute.color = 'neutral';
      extraColorAttribute._hover = { bg: 'accent.300' };
      break;
  }

  return {
    color: 'neutral',
    bg: extraColorAttribute.bg,
    _hover: {
      ...extraColorAttribute?._hover,
    },
    _disabled: {
      color: 'primary.100-60',
      bg: 'primary.500',
      _hover: {
        bg: 'unset',
      },
    },
  };
}

const breakpoints = createBreakpoints({
  base: '0em',
  sm: '40rem',
  md: '52rem',
  lg: '64rem',
  xl: '80rem',
  '2xl': '90rem',
  '4xl': '116rem',
}); // 640px 832px 1024px 1280px 1440px 1860px

const customizeTheme = {
  styles: {
    global: {
      body: {
        m: 0,
        bg: '#0E101F',
        color: 'white',
      },
      '.web3modal-modal-lightbox': {
        zIndex: '10 !important',
      },
    },
  },
  fonts: {
    body: 'Montserrat, sans-serif',
    heading: 'Montserrat, sans-serif',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
    '5xl': '3.75rem',
  },
  colors: {
    primary: {
      100: '#8491B8',
      '100-60': 'rgba(132, 145, 184, 0.6)',
      300: '#243259',
      '300-60': 'rgba(36, 50, 89, 0.6)',
      500: '#17203D',
      700: '#131833',
      '700-60': 'rgba(18, 24, 51, 0.6)',
      900: '#0E101F',
    },
    secondary: {
      300: '#FABA4B',
      500: '#F29C24',
      700: '#EF7000',
    },
    neutral: '#FFFFFF',
    gray: '#f6f6ff',
    success: '#00BF60',
    danger: '#CD334D',
    accent: { 300: '#6BA2FF', 500: '#478CFF' },
  },
  breakpoints,
  variants: {},
  components: {
    Switch: {
      baseStyle: {
        track: {
          _focus: {
            boxShadow: 'none',
          },
          bg: 'primary.300',
        },
      },
    },
    Link: {
      baseStyle: {
        _focus: {
          boxShadow: 'none',
        },
        color: 'accent.500',
      },
      variants: {
        primary: {
          _hover: { textDecoration: 'none' },
        },
        secondary: {
          color: 'primary.100',
          fontWeight: 'bold',
          _hover: {
            color: 'neutral',
            textDecoration: 'none',
          },
        },
      },
    },
    Tabs: {
      baseStyle: {
        tab: {
          boxShadow: 'unset',
          _focus: {
            boxShadow: 'unset',
          },
          _active: {
            boxShadow: 'unset',
          },
        },
      },
      variants: {
        baseTokenFilter: {
          tab: {
            px: '0.75rem',
            py: '0.5rem',
            _selected: { bgColor: 'primary.300-60', fontWeight: 'bold', color: 'neutral' },
            _hover: { color: 'neutral' },
            color: 'primary.100',
            borderRadius: '0.5rem',
            fontSize: 'sm',
          },
        },
        mainTab: {
          tablist: {
            px: '2.5rem',
            borderColor: 'primary.700',
            borderBottomWidth: '1px',
          },
          tab: {
            p: '1rem 1.5rem',
            _selected: { fontWeight: '700', color: 'neutral', borderColor: 'secondary.500', borderBottomWidth: '1px' },
            _hover: { color: 'neutral' },
            _disabled: { cursor: 'not-allowed', _hover: { color: 'primary.100' } },
            color: 'primary.100',
            fontSize: 'sm',
          },
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: '0.5rem',
        fontWeight: 'bold',
        alignItems: 'center',
        boxShadow: 'unset',
        _disabled: { color: 'primary.300' },
        _focus: {
          boxShadow: 'unset',
        },
        _active: {
          boxShadow: 'unset',
        },
      },
      sizes: {
        iconBtnSm: {
          w: '2.25rem',
          h: '2.25rem',
        },
        iconBtnLg: {
          w: '2.5rem',
          h: '2.5rem',
        },
        sm: {
          fontSize: 'sm',
          p: '0.5rem 1rem',
          h: '36px',
        },
        lg: {
          fontSize: 'md',
          p: '1rem 2rem',
          h: '56px',
        },
      },
      variants: {
        primary: variantPrimaryBtn,
        secondary: {
          color: 'primary.100',
          border: '1px solid ',
          borderColor: 'primary.100',
          _hover: {
            color: 'neutral',
          },
          _disabled: {
            border: 'none',
            borderColor: 'primary.300',
            _hover: {
              bg: 'unset',
            },
          },
        },
        tertiary: {
          fontSize: 'xs',
          color: 'primary.100',
          border: '1px solid ',
          borderColor: 'primary.100',
          p: '4px 8px',
          _hover: {
            color: 'neutral',
          },
          _disabled: {
            borderColor: 'primary.100-60',
            color: 'primary.100-60',
            _hover: {
              bg: 'unset',
              color: 'primary.100-60',
            },
          },
        },
        iconBtn: variantIconBtn,
        navMobile: {
          color: 'primary.100',
          border: 'none',
          h: '52px',
          _hover: {
            color: 'neutral',
          },
          _active: {
            color: 'neutral',
            bg: 'primary.300',
            zIndex: '1',
          },
          _disabled: {
            _hover: {
              bg: 'unset',
            },
          },
        },
        headerLink: {
          color: 'primary.100',
          fontWeight: '700',
          _hover: {
            color: 'neutral',
            textDecoration: 'none',
          },
        },
        plain: {
          p: '0',
          h: 'auto',
        },
      },
      defaultProps: {
        size: 'sm',
      },
    },
  },
};

const theme = extendTheme({ ...customizeTheme });

export default function MainThemeProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
