import React, { useState, ReactElement, useEffect } from 'react';
import { Box, Button, Flex, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { ReactComponent as IconTableSortingDefault } from '../../assets/icon-table-sorting-default.svg';
import { ReactComponent as IconTableSortingUp } from '../../assets/icon-table-sorting-up.svg';
import { ReactComponent as IconTableSortingDown } from '../../assets/icon-table-sorting-down.svg';
interface TermInfoTableProps {
  data: any;
  columns: any;
}

function TermInfoTable({ data, columns }: TermInfoTableProps): ReactElement {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // @ts-ignore
    page,
    // @ts-ignore
    pageOptions,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      // @ts-ignore
      initialState: { pageIndex: 0, pageSize: 10 },
      autoResetSortBy: false,
    },
    useSortBy,
    usePagination,
  );

  const [selectedPage, setSelectedPage] = useState(0);
  useEffect(() => {
    gotoPage(selectedPage);
  }, [pageIndex, selectedPage]);

  const renderPagination = () => (
    <Flex color='primary.100'>
      {pageOptions.map((pageNum: number) => (
        <Button
          key={pageNum}
          onClick={() => {
            setSelectedPage(pageNum);
          }}
          pr='8px'
          px='15px'
          fontSize='md'
          color={pageIndex === pageNum ? 'neutral' : ''}
          fontWeight={pageIndex === pageNum ? 'bold' : ''}
          _hover={{
            color: 'neutral',
          }}
        >
          {pageNum + 1}
        </Button>
      ))}
    </Flex>
  );

  return (
    <Box>
      <Box
        overflowX='auto'
        sx={{
          '&::-webkit-scrollbar': {
            h: '6px',
            bg: 'primary.900',
          },
          '&::-webkit-scrollbar-thumb': {
            bg: 'primary.100',
          },
        }}
      >
        <Table {...getTableProps()} w='full'>
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
                  fontWeight='bold'
                >
                  {headerGroup.headers.map((column: any) => {
                    const { key: columnKey, ...restColumnGroupProps } = column.getHeaderProps(
                      // @ts-ignore
                      column.getSortByToggleProps(),
                    );
                    return (
                      <Th
                        key={columnKey}
                        {...restColumnGroupProps}
                        px={{ base: '12px', xl: '16px' }}
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
                        _hover={column.canSort ? { color: 'neutral' } : ''}
                      >
                        <Flex align='center'>
                          {column.render('Header')}
                          <Box>
                            {column.canSort ? (
                              column.isSorted ? (
                                column.isSortedDesc ? (
                                  <IconTableSortingDown />
                                ) : (
                                  <IconTableSortingUp />
                                )
                              ) : (
                                <IconTableSortingDefault />
                              )
                            ) : (
                              ''
                            )}
                          </Box>
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              );
            })}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row: any) => {
              prepareRow(row);
              const { key: rowKey, ...restRowProps } = row.getRowProps();
              return (
                <Tr key={rowKey} {...restRowProps} _even={{ bg: 'primary.500' }} _odd={{ bg: 'primary.300-60' }}>
                  {row.cells.map((cell: any) => {
                    const { key: cellKey, ...restCellProps } = cell.getCellProps();
                    return (
                      <Td
                        key={cellKey}
                        {...restCellProps}
                        px={{ base: '12px', xl: '16px' }}
                        pr={cell.column.id === 'proxyIcon' ? '0' : ''}
                        border='0'
                        fontWeight='bold'
                        fontSize='sm'
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
      </Box>
      <Flex
        justify='center'
        align='center'
        h='88px'
        bg='primary.500'
        borderTop='2px solid'
        borderColor='primary.700'
        borderBottomRadius='8px'
      >
        <div>{renderPagination()}</div>
      </Flex>
    </Box>
  );
}

export default TermInfoTable;
