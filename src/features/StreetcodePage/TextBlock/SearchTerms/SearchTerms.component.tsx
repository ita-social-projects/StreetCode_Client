import { useEffect, useState } from 'react';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';
import parse from 'html-react-parser';

import { Popover } from 'antd';

interface Props {
  mainText: string;
}

const keywordColoring = {
    color: '#8D1F16',
};
const parser = (input: string) => parse(input, {
    replace: () => {
        const newInput = input.split('<p>').pop();
        const inputWithoutP = newInput?.replace('</p>', '');

        return <>{parse(String(inputWithoutP))}</>;
    },
});

const SearchTerms = ({ mainText }: Props) => {
    const { termsStore, relatedTermStore } = useMobx();
    const { fetchTerms, getTermArray } = termsStore;
    const { fetchRelatedTermsByTermId, getRelatedTermsArray } = relatedTermStore;
    const [currentTermId, setCurrentTermId] = useState(0);
    useAsync(fetchTerms);

    useEffect(() => {
        getTermArray.forEach((term) => {
            setCurrentTermId(term.id);
            fetchRelatedTermsByTermId(term.id);
        });
    }, [currentTermId, fetchRelatedTermsByTermId, getTermArray]);

    const searchTerms: string[] = [];
    const descriptiveSearchTerms = new Map<string, string | undefined>();

    getTermArray.forEach((term) => {
        descriptiveSearchTerms.set(term.title, term.description);
        getRelatedTermsArray
            .filter((relatedTerm) => relatedTerm.termId === term.id)
            .forEach((relatedTerm) => {
                descriptiveSearchTerms.set(relatedTerm.word, term.description);
                searchTerms.push(relatedTerm.word);
            });
        searchTerms.push(term.title);
    });

    const splittedKeywordText = mainText.split(
        new RegExp(
            `(${searchTerms.map((st) => st.toLocaleLowerCase()).join('|')}|<[^p>]*>[^>]*</[^p>]*>)`,
            'gi',
        ),
    );

    const checkMapping = (part: string) => {
        if (searchTerms.includes(part)) {
            const index = searchTerms.indexOf(part);
            searchTerms.splice(index, 1);
            return true;
        }
        return false;
    };

    return (
        <div>
            {splittedKeywordText.map((part, idx) => (
                <span
                    key={idx}
                    style={checkMapping(part) ? keywordColoring : undefined}
                >
                    {searchTerms.includes(part) ? (
                        <Popover
                            overlayStyle={{ width: '300px' }}
                            content={descriptiveSearchTerms.get(part)}
                        >
                            <span style={{ cursor: 'pointer' }}>{parse(`${part}`)}</span>
                        </Popover>
                    ) : (
                        <>
                            {parser(`${part}`)}
                        </>
                    )}
                </span>
            ))}
        </div>
    );
};
export default SearchTerms;
