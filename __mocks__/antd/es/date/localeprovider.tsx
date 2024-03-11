import React, { ReactNode } from "react";
import dayjs from "dayjs";
import "dayjs/locale/uk";

interface MockLocaleProviderProps {
  children: ReactNode;
}

interface LangData {
  shortWeekDays: string[];
  shortMonths: string[];
}

const MockLocaleProvider: React.FC<MockLocaleProviderProps> & {
  lang: LangData;
} = ({ children }) => {
  dayjs.locale("uk");
  const dayJsUa = require("dayjs/locale/uk");

  Object.assign(MockLocaleProvider.lang, {
    shortWeekDays: dayJsUa.weekdaysShort(),
    shortMonths: dayJsUa.monthsShort(),
  });

  return (
    <>
      <input type="date" name="creation-date"/>
      {children}
    </>
  );
};

MockLocaleProvider.lang = {
  shortWeekDays: [],
  shortMonths: [],
};

export default MockLocaleProvider;
