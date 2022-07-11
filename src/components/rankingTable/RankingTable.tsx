import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useTable } from 'react-table';
import useWindowSize from '../../hooks/useWindowSize';
import { ResponsiveView } from '../../constants/responsive';
import { columns, mobileColumns } from '../../components/rankingTable/TableColumns';

type Props = {
  data: any;
};

function RankingTable({ data }: Props) {
  const windowSize = useWindowSize();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: windowSize === ResponsiveView.WEB ? columns : mobileColumns,
    data,
  });

  return (
    <Table {...getTableProps()} w='full'>
      {windowSize === ResponsiveView.WEB && (
        <Thead>
          {headerGroups.map((headerGroup: any) => {
            const { key: headerKey, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <Tr
                key={headerKey}
                {...restHeaderGroupProps}
                h='4rem'
                bg='primary.500'
                borderBottom='2px solid'
                borderColor='primary.700'
                fontWeight='700'
              >
                {headerGroup.headers.map((column: any) => {
                  const { key: columnKey, ...restColumnGroupProps } = column.getHeaderProps();
                  return (
                    <Th
                      key={columnKey}
                      {...restColumnGroupProps}
                      fontSize='sm'
                      border='0'
                      color='primary.100'
                      textTransform='none'
                      _first={{
                        borderTopLeftRadius: '8px',
                      }}
                      _last={{
                        borderTopRightRadius: '8px',
                      }}
                    >
                      {column.render('Header')}
                    </Th>
                  );
                })}
              </Tr>
            );
          })}
        </Thead>
      )}
      <Tbody {...getTableBodyProps()}>
        {rows.map((row: any, index) => {
          prepareRow(row);
          const { key: rowKey, ...restRowProps } = row.getRowProps();
          return (
            <Tr
              key={rowKey}
              {...restRowProps}
              _even={{ bg: 'primary.500' }}
              _odd={{ bg: 'primary.300-60' }}
              verticalAlign={{ base: 'top', lg: 'middle' }}
            >
              {row.cells.map((cell: any) => {
                const { key: cellKey, ...restCellProps } = cell.getCellProps();
                const isLastRow = Object.keys(rows).length - 1 === index;
                return (
                  <Td
                    key={cellKey}
                    {...restCellProps}
                    h='4.5rem'
                    py={{ base: '16px', lg: '18px' }}
                    pr='0'
                    border='0'
                    _first={Object.assign(
                      windowSize === ResponsiveView.WEB ? { pl: '50px' } : { pl: '20px' },
                      isLastRow && { borderBottomLeftRadius: '8px' },
                    )}
                    _last={Object.assign(
                      windowSize === ResponsiveView.WEB ? { pr: '60px' } : { pr: '20px' },
                      isLastRow && { borderBottomRightRadius: '8px' },
                    )}
                  >
                    {cell.render('Cell')}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

export default RankingTable;
