import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import dayjs from 'dayjs';

import { DateViewPattern, getSeason } from '@/models/timeline/chronology.model';

export default function FromDateToString(date: Date, dataViewType: DateViewPattern) {
    switch (dataViewType) {
    case DateViewPattern.Year: return format(new Date(date), 'yyyy');
    case DateViewPattern.MonthYear: return format(date, 'yyyy, MMMM', { locale: uk });
    case DateViewPattern.SeasonYear: return `${format(date, 'yyyy,')} ${getSeason(dayjs(date))}`;
    case DateViewPattern.DateMonthYear: return format(new Date(date), 'yyyy, d MMMM', { locale: uk });
    default: return '';
    }
}
