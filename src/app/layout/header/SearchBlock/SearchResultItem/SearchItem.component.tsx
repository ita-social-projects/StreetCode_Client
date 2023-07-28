import './SearchItem.styles.scss';

import { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';
import htmlReactParser, { domToReact } from 'html-react-parser';
interface Props {
    searchResultItem: StreetcodeFilterResultDTO;
}

const SearchResultItem = ({ searchResultItem } : Props) => {
    const url = `/${searchResultItem.streetcodeTransliterationUrl
    }${searchResultItem.blockName ? (`#${searchResultItem.blockName}`) : ''}`;

    const sourceName = `Стріткод #${searchResultItem.streetcodeIndex.toString().padStart(4, '0')
    }${searchResultItem.sourceName ? `/${searchResultItem.sourceName}` : ''}`;

    const contentToDisplay = searchResultItem.content ? searchResultItem.content.slice(0, 67) : '';

    return (
        <a href={url} className="resultItemContainer">
            <div className="resultItemContent">
                 {htmlReactParser(contentToDisplay)}
            </div>
            <div className="resultSourceName">
                {sourceName}
            </div>
        </a>
    );
};

export default SearchResultItem;
