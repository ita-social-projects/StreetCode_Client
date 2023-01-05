import './TimelineBlock.styles.scss';

import SimpleSlider from '@features/SlickSlider/SlickSlider.component';
import BlockHeading from '@features/BlockHeading/BlockHeading.component';

const TimelineBlock = () => {
    return (
        <>
            <BlockHeading headingText={"Хронологія"} />
            <div className={"timeSpanContainer"}>
                <div className={"timelineYearTicksContainer"}>
                    <span className={"timelineYearTick"}><span>1894</span></span>
                    <span className={"timelineYearTick"}><span>1894</span></span>
                    <span className={"timelineYearTick"}><span>1894</span></span>
                    <span className={"timelineYearTick"}><span>1894</span></span>
                    <span className={"timelineYearTick"}><span>1894</span></span>
                    <span className={"timelineYearTick"}><span>1894</span></span>
                    <span className={"timelineYearTick"}><span>1894</span></span>
                </div>
            </div>
            <div className={"timelineContainer"}>
                <div className={"timelineSquareContainer"}>
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                </div>
                <div className={"timelineItemContainer"}>
                    <div className={"timelineItem"}>
                        <div className={"timelineItemContent"}>
                            <p className={"timelineItemDate"}>1894, 13 серпня</p>
                            <h1 className={"timelineItemTitle"}>
                                {"«Історія України-Руси»"}
                            </h1>
                            <p className={"timelineItemDescription"}>
                                У 1894 році Грушевський за рекомендацією Володимира Антоновича призначений
                                на посаду ординарного професора кафедри всесвітньої історії з окремим оглядом
                                історії Східної Європи Львівського університету. Протягом 1897—1898 років він
                                написав 1-й том своєї фундаментальної праці — «Історія України-Руси».
                            </p>
                        </div>
                    </div>
                    <div className={"timelineItem"}>
                        <div className={"timelineItemContent"}>
                            <p className={"timelineItemDate"}>1894, 13 серпня</p>
                            <h1 className={"timelineItemTitle"}>
                                {"«Історія України-Руси»"}
                            </h1>
                            <p className={"timelineItemDescription"}>
                                У 1894 році Грушевський за рекомендацією Володимира Антоновича призначений
                                на посаду ординарного професора кафедри всесвітньої історії з окремим оглядом
                                історії Східної Європи Львівського університету. Протягом 1897—1898 років він
                                написав 1-й том своєї фундаментальної праці — «Історія України-Руси».
                            </p>
                        </div>
                    </div>
                    <div className={"timelineItem"}>
                        <div className={"timelineItemContent"}>
                            <p className={"timelineItemDate"}>1894, 13 серпня</p>
                            <h1 className={"timelineItemTitle"}>
                                {"«Історія України-Руси»"}
                            </h1>
                            <p className={"timelineItemDescription"}>
                                У 1894 році Грушевський за рекомендацією Володимира Антоновича призначений
                                на посаду ординарного професора кафедри всесвітньої історії з окремим оглядом
                                історії Східної Європи Львівського університету. Протягом 1897—1898 років він
                                написав 1-й том своєї фундаментальної праці — «Історія України-Руси».
                            </p>
                        </div>
                    </div>
                </div>
                <div className={"timelineSquareContainer bottom"}>
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                    <div className={"timelineSquare"} />
                </div>
            </div>
        </>
    );
}

export default TimelineBlock;