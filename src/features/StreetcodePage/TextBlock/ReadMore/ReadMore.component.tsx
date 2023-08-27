/* eslint-disable react/jsx-no-useless-fragment */
import './ReadMore.styles.scss';

import useToggle from '@hooks/stateful/useToggle.hook';
import SearchTerms from '@streetcode/TextBlock/SearchTerms/SearchTerms.component';

import { moreTextEvent } from '@/app/common/utils/googleAnalytics.unility';

interface Props {
  text: string;
  maxTextLength?: number;
}

const ReadMore = ({ text, maxTextLength = 2e3 }: Props) => {
    const {
        toggleState: isReadMore,
        handlers: { toggle },
    } = useToggle(true);

    return (
        <>
            {(text.length > maxTextLength) ? (
                <div className="text">
                    <div
                        className={isReadMore ? 'textShort' : undefined}
                        style={{ whiteSpace: 'pre-line' }}
                    >
                        <SearchTerms mainText={text} />
                    </div>
                    <div className="readMoreContainer">
                        <span
                            className="readMore"
                            onClick={() => {
                                toggle();
                                moreTextEvent();
                            }}
                        >
                            {isReadMore ? 'Трохи ще' : 'Дещо менше'}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="mainTextContent">
                    <SearchTerms mainText={text} />
                </div>
            )}
        </>
    );
};

export default ReadMore;
