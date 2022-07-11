import { useMemo } from 'react';
import { ArchiveIGainTerm, IGainTerm } from '../constants/termInfo/iGainTermData';

function useTermsStageSeparator(terms: ArchiveIGainTerm[]): IGainTerm[][] {
  return useMemo(() => {
    const termsSeparator = terms.findIndex((iGainTerm) => {
      return parseInt(iGainTerm.closeTime.toString() || '0') * 1000 > Date.now();
    });
    let expiredTerms: IGainTerm[] = [];
    let activeTerms: IGainTerm[] = [];

    if (termsSeparator >= 0) {
      expiredTerms = terms.slice(0, termsSeparator);
      activeTerms = terms.slice(termsSeparator);
    } else {
      expiredTerms = terms;
    }

    return [expiredTerms, activeTerms];
  }, [terms]);
}

export default useTermsStageSeparator;
