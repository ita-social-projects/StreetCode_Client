import './ReadMore.styles.scss';
import SearchTerms from '@streetcode/TextBlock/SearchTerms/SearchTerms.component';
import useToggle from '@hooks/stateful/useToggle.hook';

interface Props {
    children: string;
    maxTextLength?: number;
}

const ReadMore = ({ children: text, maxTextLength = 2e3 }: Props) => {
 
    const { toggleState: isReadMore, handlers: { toggle } } = useToggle(true);

    return (
        <>
            {text.length > text.slice(0, maxTextLength).length ? (
                <div className="text" style={{ whiteSpace: 'pre-line' }}>
                    <div className={isReadMore ? "textShort": undefined} style={{ whiteSpace: 'pre-line' }}>
                        <SearchTerms mainText={text} />
                    </div>
                    <div className="readMoreContainer">
                        <span className="readMore" onClick={toggle}>
                            {isReadMore ? 'Трохи ще':'Дещо менше'}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="mainTextContent" style={{ whiteSpace: 'pre-line' }}>
                    <SearchTerms mainText={text}/>
                </div>
            )}
        </>
    );
};

export default ReadMore;