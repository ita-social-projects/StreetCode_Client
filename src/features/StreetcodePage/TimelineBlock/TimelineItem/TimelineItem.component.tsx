import './TimelineItem.styles.scss';

import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import TimelineItem from '@/models/timeline/chronology.model';

const truncateCharString = (str?: string, symbolCount = 350): string | undefined => str && (
    str.length <= symbolCount ? str : `${str.substring(0, symbolCount - 3)}...`
);

interface Props {
    timelineItem: TimelineItem;
}

const TimelineSlideCard = ({ timelineItem: { date, description, historicalContexts, title } } : Props) => (
    <div className="timelineItem">
        <div className="timelineItemContent">
            <p className="timelineItemDate">
                {format(new Date(date), 'yyyy, d MMMM', { locale: uk })}
            </p>
            <div className="timelineItemHistoricalContexts">
                {historicalContexts.map(({ id, title: ctxTitle }, idx) => (
                    <span key={id} className="historicalContext">
                        {`${ctxTitle} ${(idx !== historicalContexts.length - 1) ? '& ' : ''}`}
                    </span>
                ))}
                {/* {historicalContexts.map((ctx) => ctx.title).join(' | ')} */}
            </div>
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
