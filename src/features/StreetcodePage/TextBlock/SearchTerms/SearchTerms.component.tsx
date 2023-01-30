import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';
import Rectangle110 from '@images/art-gallery/Rectangle110.png';
import { Popover } from 'antd';
import ArtGalleryItem from '../../ArtGallery/ArtGalleryItem/ArtGalleryItem.component';
import BlockHeading from '../../HeadingBlock/BlockHeading.component';

interface Props {
  mainText: string;
}

const keywordColoring = {
    color: '#8D1F16',
};

const SearchTerms = ({ mainText }: Props) => {
    const { termsStore: { fetchTerms, getTermArray } } = useMobx();
    useAsync(fetchTerms);

    const searchTerms: string[] = [];
    const descriptiveSearchTerms = new Map<string, string | undefined>();

    getTermArray().forEach((term) => {
        descriptiveSearchTerms.set(term.title, term.description);
        searchTerms.push(term.title);
    });

    const splittedKeywordText = mainText.split(
        new RegExp(
            `(${searchTerms.map((st) => st.toLocaleLowerCase()).join('|')})`,
            'gi',
        ),
    );

    return (
        <div>
            {splittedKeywordText.map((part, idx) => (
                <span
                    key={idx}
                    style={searchTerms.includes(part) ? keywordColoring : undefined}
                >
                    {searchTerms.includes(part) ? (
                        <Popover
                            overlayStyle={{ width: '300px' }}
                            content={descriptiveSearchTerms.get(part)}
                        >
                            <span style={{ cursor: 'pointer' }}>{part}</span>
                        </Popover>
                    ) : (
                        <span>{part}</span>
                    )}
                </span>
            ))}
        </div>
    );
};
export default SearchTerms;
