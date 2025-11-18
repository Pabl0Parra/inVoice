import { createContext, useContext, useState, type ReactNode, type FC } from 'react';

/**
 * Available application tabs
 * - part1: Invoice Generator (Part 1 - completed features)
 * - part2: Spanish Painting Company Features (Part 2 - new features)
 */
export type AppTab = 'part1' | 'part2';

interface TabContextValue {
  /** Currently active tab */
  activeTab: AppTab;
  /** Set the active tab */
  setActiveTab: (tab: AppTab) => void;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
}

/**
 * TabProvider component
 * Manages the active tab state for the application
 * Defaults to Part 1 (Invoice Generator)
 */
export const TabProvider: FC<TabProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('part1');

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

/**
 * Custom hook to access tab context
 * @throws {Error} If used outside of TabProvider
 */
export const useTab = (): TabContextValue => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
};
