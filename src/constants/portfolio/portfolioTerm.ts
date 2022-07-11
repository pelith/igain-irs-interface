import { IGainTerm } from '../termInfo/iGainTermData';
import { UserInfo } from '../userInfo';

interface PortfolioTerm {
  userInfo: UserInfo;
  termData: IGainTerm;
}

export default PortfolioTerm;
