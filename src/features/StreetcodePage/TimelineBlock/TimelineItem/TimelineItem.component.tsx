import './TimelineItem.styles.scss';

import { useState } from 'react';

import monthsMap from '@/app/common/constants/month-map';
import FromDateToString from '@/app/common/utils/FromDateToString';
import TimelineItem from '@/models/timeline/chronology.model';

const truncateCharString = (str?: string, symbolCount = 400): string | undefined => str && (
    str.length <= symbolCount ? str : `${str.substring(0, symbolCount - 3)}...`
);

interface Props {
    timelineItem: TimelineItem;
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
            <div className="timelineItemContent" onDoubleClick={clickHandle} role="presentation" >
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
