import './TimelineItem.styles.scss';

import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import dayjs from 'dayjs';

import TimelineItem, { DateViewPattern, getSeason } from '@/models/timeline/chronology.model';

const truncateCharString = (str?: string, symbolCount = 400): string | undefined => str && (
    str.length <= symbolCount ? str : `${str.substring(0, symbolCount - 3)}...`
);

interface Props {
    timelineItem: TimelineItem;
}
function FromDateToString(date: Date, dataViewType:DateViewPattern) {
    switch (dataViewType) {
    case DateViewPattern.Year: return format(new Date(date), 'yyyy');
    case DateViewPattern.MonthYear: return format(date, 'yyyy, MMMM', { locale: uk });
    case DateViewPattern.SeasonYear: return `${getSeason(dayjs(date))} ${format(date, 'yyyy')}`;
    case DateViewPattern.DateMonthYear: return format(new Date(date), 'yyyy, d MMMM', { locale: uk });
    default: return '';
    }
}
const TimelineSlideCard = ({
    timelineItem: {
        date, description,
        historicalContexts, title, dateViewPattern,
    },
} : Props) => (
    <div className="timelineItem">
        <div className="timelineItemContent">
            <p className="timelineItemMetadata">
                {FromDateToString(date, dateViewPattern)}
                {historicalContexts.map(({ id, title: ctxTitle }) => (
                    <span key={id} className="historicalContext">
                        {`. ${ctxTitle}`}
                    </span>
                ))}
            </p>
            <p className="timelineItemTitle">
                {title}
            </p>
            <p className="timelineItemDescription">
                {truncateCharString(description)}
            </p>
        </div>
    </div>
);

export default TimelineSlideCard;
