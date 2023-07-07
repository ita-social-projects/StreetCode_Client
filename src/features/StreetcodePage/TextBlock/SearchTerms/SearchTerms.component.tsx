import parse from 'html-react-parser';

import { Popover } from 'antd';

interface Props {
    mainText: string;
}

const keywordColoring = {
    color: '#8D1F16',
};

const SearchTerms = ({ mainText }: Props) => {
    const splittedKeywordText = mainText.split(/(<Popover>.*?<\/Popover>)/g);

    console.log(splittedKeywordText);

    const popoverParser = (input: string) => parse(input, {
        // eslint-disable-next-line react/no-unstable-nested-components
        replace: () => (
            <Popover
                key={input.match(/<Term>.*?<\/Term>/g)?.at(0)?.toString()}
                style={keywordColoring}
                overlayStyle={{ width: '300px' }}
                content={parse(input.match(/<Desc>.*?<\/Desc>/g)?.at(0)?.toString() ?? '')}
            >
                <span style={{ cursor: 'pointer' }}>
                    {parse(input.match(/<Term>.*?<\/Term>/g)?.at(0)?.toString() ?? '')}
                </span>
            </Popover>
        ),
    });

    return (
        <div>
            {splittedKeywordText.map((part) => (
                // eslint-disable-next-line react/style-prop-object
                <span>
                    {part.includes('Popover') ? (
                        <span
                            style={keywordColoring}
                            key={part}
                        >
                            {popoverParser(`${part}`)}
                        </span>
                    ) : (
                        <>
                            {parse(`${part}`)}
                        </>
                    )}
                </span>
            ))}
        </div>
    );
};
export default SearchTerms;
