import React, { ReactElement } from 'react';
import { Box, Accordion, AccordionItem, AccordionIcon, AccordionPanel, AccordionButton } from '@chakra-ui/react';
import { Markdown } from 'react-showdown';
import useWindowSize from '../hooks/useWindowSize';
import { ResponsiveView } from '../constants/responsive';
import { FAQ_LIST } from '../constants/faqConfig';
import useSWR from 'swr';

interface FAQsItemProps {
  question: string;
  answer: ReactElement;
}

const FAQsItem = ({ question, answer }: FAQsItemProps) => {
  const windowSize = useWindowSize();
  return (
    <AccordionItem borderTop='none' borderBottom='2px solid' borderBottomColor='primary.900'>
      <h2>
        <AccordionButton p='24px 40px' _focus={{ boxShadow: 'unset' }}>
          <Box flex='1' textAlign='left' fontWeight='bold' fontSize='xl'>
            {question}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel
        p='30px 40px'
        sx={{
          div: { p: windowSize === ResponsiveView.WEB ? '0 68px 0 24px' : '0 24px' },
          h2: { fontSize: 'xl', fontWeight: 'bold' },
          p: { fontSize: 'sm', lineHeight: '20px' },
          a: { color: 'accent.500' },
          ol: { px: '1rem' },
          li: { fontSize: 'sm', lineHeight: '20px' },
          code: { bg: 'primary.100', p: '2px' },
        }}
      >
        {answer}
      </AccordionPanel>
    </AccordionItem>
  );
};

function FAQsAccordion(): ReactElement {
  const fetcher = (url: string) => {
    const fileNames = FAQ_LIST.map((faq) => faq.answerFileName);
    return Promise.all(fileNames.map((fileName) => fetch(url + fileName).then((r) => r.text())));
  };

  const { data: answerList } = useSWR(`${process.env.PUBLIC_URL}/faqMd/`, fetcher);
  return (
    <Box bg='primary.700' borderRadius='0.5rem'>
      <Accordion allowToggle>
        {FAQ_LIST.map((ele, index) => (
          <FAQsItem
            key={index}
            question={ele.question}
            answer={<Markdown markdown={answerList ? answerList[index].replaceAll('\n\n', '\n\n<br>') : ''} />}
          />
        ))}
      </Accordion>
    </Box>
  );
}

export default FAQsAccordion;
