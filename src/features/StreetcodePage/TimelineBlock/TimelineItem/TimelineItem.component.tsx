import './TimelineItem.styles.scss';
import { useState } from 'react';

import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import dayjs from 'dayjs';

import TimelineItem, { DateViewPattern, getSeason } from '@/models/timeline/chronology.model';

const monthsMap = new Map([
    ['січня', 'січень'],
    ['лютого', 'лютий'],
    ['березня', 'березень'],
    ['квітня', 'квітень'],
    ['травня', 'травень'],
    ['червня', 'червень'],
    ['липня', 'липень'],
    ['серпня', 'серпень'],
    ['вересня', 'вересень'],
    ['жовтня', 'жовтень'],
    ['листопада', 'листопад'],
    ['грудня', 'грудень'],
]);

const truncateCharString = (str?: string, symbolCount = 400): string | undefined => str && (
    str.length <= symbolCount ? str : `${str.substring(0, symbolCount - 3)}...`
);

interface Props {
    timelineItem: TimelineItem;
}
function FromDateToString(date: Date, dataViewType: DateViewPattern) {
    switch (dataViewType) {
        case DateViewPattern.Year: return format(new Date(date), 'yyyy');
        case DateViewPattern.MonthYear: return format(date, 'yyyy, MMMM', { locale: uk });
        case DateViewPattern.SeasonYear: return `${format(date, 'yyyy,')} ${getSeason(dayjs(date))}`;
        case DateViewPattern.DateMonthYear: return format(new Date(date), 'yyyy, d MMMM', { locale: uk });
        default: return '';
    }
}
const TimelineSlideCard = ({
    timelineItem: {
        date, description,
        historicalContexts, title, dateViewPattern,
    },
}: Props) => {
    let newDate: string;
    if (dateViewPattern == 1) {
        const words = FromDateToString(new Date(date), dateViewPattern).split(' ');
        newDate = `${words[0]} ${monthsMap.get(words[1])}`;
    } else {
        newDate = FromDateToString(new Date(date), dateViewPattern);
    }

    const [isCopied, setIsCopied] = useState(false);

    const clickHandle = async () => {
        if (description) {
            await navigator.clipboard.writeText(description);
        }
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <div className="timelineItem">
            <div className="timelineItemContent" onClick={clickHandle} role="presentation" >
                <p className="timelineItemMetadata">
                    {newDate}
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
                {isCopied && <div className="copy-message-relative">Скопійовано  </div>}
            </div>
        </div>
    );
};

export default TimelineSlideCard;
