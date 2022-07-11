import { IGainTerm } from '../constants/termInfo/iGainTermData';

export const checkTermExpired = (termData: IGainTerm) => termData.closeTime * 1000 <= Date.now();
