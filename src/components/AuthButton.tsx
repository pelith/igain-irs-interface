import withApproveTokenCheckWrapper from '../hoc/withApproveTokenCheckWrapper';
import withDelegationCheckWrapper from '../hoc/withDelegationCheckWrapper';
import withConnectWalletCheckWrapper from '../hoc/withConnectWalletCheckWrapper';
import withWrongNetworkCheckWrapper from '../hoc/withWrongNetworkCheckWrapper';
import MainButton from './MainButton';

export const AuthAllCheckButton = withApproveTokenCheckWrapper(
  withWrongNetworkCheckWrapper(withConnectWalletCheckWrapper(MainButton)),
);

export const AuthDelegationCheckButton = withDelegationCheckWrapper(
  withWrongNetworkCheckWrapper(withConnectWalletCheckWrapper(MainButton)),
);

export const AuthNetworkCheckButton = withWrongNetworkCheckWrapper(withConnectWalletCheckWrapper(MainButton));
