import './TimelineItem.styles.scss';

const truncateAfter = (str: string, symbolCount = 400) => ((str.length) <= 400
    ? str : `${str.substring(0, symbolCount - 3)}...`);

const TimelineItem = () => (
    <div className="timelineItem">
        <div className="timelineItemContent">
            <p className="timelineItemDate">1894, 13 серпня</p>
            <h1 className="timelineItemTitle">
                «Історія України-Руси»
            </h1>
            <p className="timelineItemDescription">
                {truncateAfter(
                    `У 1894 році Грушевський за рекомендацією Володимира Антоновича призначений
                    на посаду ординарного професора кафедри всесвітньої історії з окремим оглядом
                    історії Східної Європи Львівського університету. Протягом 1897—1898 років він
                    написав 1-й том своєї фундаментальної праці — «Історія України-Руси».`,
                )}
            </p>
        </div>
    </div>
);

export default TimelineItem;
