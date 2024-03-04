import React, { ReactNode } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';

interface MockLocaleProviderProps {
  children: ReactNode;
}

const MockLocaleProvider: React.FC<MockLocaleProviderProps> = ({ children }) => {
  dayjs.locale('uk');

  return <>{children}</>;
};

export default MockLocaleProvider;
