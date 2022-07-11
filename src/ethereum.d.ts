interface Window {
  ethereum?: {
    isMetaMask?: true;
    isImToken?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    request?: any;
  };
  web3?: {};
}
