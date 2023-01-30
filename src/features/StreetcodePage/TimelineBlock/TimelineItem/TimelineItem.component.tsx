import './TimelineItem.styles.scss';

import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import TimelineItem from '@/models/timeline/chronology.model';

const truncateCharString = (str?: string, symbolCount = 400): string | undefined => str && (
    str.length <= symbolCount ? str : `${str.substring(0, symbolCount - 3)}...`
);

interface Props {
    timelineItem: TimelineItem;
}

const TimelineSlideCard = ({ timelineItem: { date, description, historicalContexts, title } } : Props) => (
    <div className="timelineItem">
        <div className="timelineItemContent">
            <p className="timelineItemMetadata">
                {format(new Date(date), 'yyyy, d MMMM', { locale: uk })}
                {historicalContexts.map(({ id, title: ctxTitle }) => (
                    <span key={id} className="historicalContext">
                        {`, ${ctxTitle}`}
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
