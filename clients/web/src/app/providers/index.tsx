import { type FC, type ReactNode } from "react";
import { StoreContext, rootStore } from "../../store/root.store";

interface IProviders {
  /** Content that will be wrapped by providers. */
  readonly children: ReactNode; // JSX.Element -> ReactNode (лучше)
}

export const Providers: FC<IProviders> = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};