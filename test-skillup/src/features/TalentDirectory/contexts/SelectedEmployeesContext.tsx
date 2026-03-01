import { createContext, useMemo, useState } from 'react';

type SelectedEmployeesContextType = {
  selectedEmployees: Set<string>;
  setSelectedEmployees: Function;
};

export const SelectedEmployeesContext = createContext<SelectedEmployeesContextType>({
  selectedEmployees: new Set([]),
  setSelectedEmployees: () => {},
});

export function SelectedEmployeesProvider({ children }: { children: React.ReactNode }) {
  const [selectedEmployees, setSelectedEmployees] = useState(new Set([]));

  const initalContextVal = useMemo(
    () => ({ selectedEmployees, setSelectedEmployees }),
    [selectedEmployees, setSelectedEmployees],
  );

  return (
    <SelectedEmployeesContext.Provider value={initalContextVal}>
      {children}
    </SelectedEmployeesContext.Provider>
  );
}
