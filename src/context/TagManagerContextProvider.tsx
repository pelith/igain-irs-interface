import React, { useEffect, useState } from 'react';
import TagManager, { DataLayerArgs } from 'react-gtm-module';

interface ITagManager {
  dataLayer: (dataLayerArgs: DataLayerArgs) => void;
}
export interface TagManagerContextInterface {
  tagManager?: ITagManager;
}

const TagManagerContext = React.createContext({} as TagManagerContextInterface);

const TagManagerContextProvider: React.FC = ({ children }) => {
  const [tagManager, setTagManager] = useState<ITagManager | undefined>();
  useEffect(() => {
    if (process.env.REACT_APP_GTM_ID) {
      const tagManagerArgs = {
        gtmId: process.env.REACT_APP_GTM_ID,
      };

      TagManager.initialize(tagManagerArgs);
      setTagManager(TagManager);
    }
  }, []);

  return (
    <TagManagerContext.Provider
      value={{
        tagManager,
      }}
    >
      {children}
    </TagManagerContext.Provider>
  );
};

export { TagManagerContext };
export default TagManagerContextProvider;
