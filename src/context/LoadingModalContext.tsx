import React, { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';

export interface LoadingModalContextInterface {
  isLoadingModalOpen: boolean;
  loadingMessage: string;
  setLoadingMessage: React.Dispatch<React.SetStateAction<string>>;
  onLoadingModalOpen: () => void;
  onLoadingModalClose: () => void;
}

const LoadingModalContext = React.createContext({} as LoadingModalContextInterface);

const LoadingModalContextProvider: React.FC = ({ children }) => {
  const [loadingMessage, setLoadingMessage] = useState('Waiting for confirmation');
  const { isOpen: isLoadingModalOpen, onOpen: onLoadingModalOpen, onClose: onLoadingModalClose } = useDisclosure();

  return (
    <LoadingModalContext.Provider
      value={{
        isLoadingModalOpen,
        onLoadingModalOpen,
        onLoadingModalClose,
        loadingMessage,
        setLoadingMessage,
      }}
    >
      {children}
    </LoadingModalContext.Provider>
  );
};

export { LoadingModalContext };
export default LoadingModalContextProvider;
