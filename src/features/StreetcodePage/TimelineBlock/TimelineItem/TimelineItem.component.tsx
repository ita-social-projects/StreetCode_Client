import './TimelineItem.styles.scss';

import TimelineI from '@/models/timeline/chronology.model';

const truncateAfter = (str: string, symbolCount = 400) => ((str.length) <= 400
    ? str : `${str.substring(0, symbolCount - 3)}...`);

interface Props {
    timelineItem: TimelineI;
}

const getLocalString = (date: Date) => new Date(date)
    .toLocaleDateString('uk-Uk', { year: 'numeric', month: 'long', day: '2-digit' });

const TimelineItem = ({ timelineItem } : Props) => (
    <div className="timelineItem">
        <div className="timelineItemContent">
            <p className="timelineItemDate">{getLocalString(timelineItem.date)}</p>
            <div className="timelineItemHistoricalContexts">
                {timelineItem.historicalContexts.map((hc) => (
                    <p className="historicalContext">{hc.title}</p>
                ))}
            </div>
            <p className="timelineItemTitle">
                {timelineItem.title}
            </p>
            <p className="timelineItemDescription">
                {truncateAfter(
                    timelineItem.description ? timelineItem.description : '',
                )}
            </p>
        </div>
    </div>
);

export default TimelineItem;
