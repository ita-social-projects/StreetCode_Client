import './SearchItem.styles.scss';

import { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';

interface Props {
    searchResultItem: StreetcodeFilterResultDTO;
}

const SearchResultItem = ({ searchResultItem } : Props) => {
    const url = `/${searchResultItem.streetcodeTransliterationUrl
    }${searchResultItem.blockName ? (`#${searchResultItem.blockName}`) : ''}`;

    const sourceName = `Стріткод #${searchResultItem.streetcodeIndex.toString().padStart(4, '0')
    }${searchResultItem.sourceName ? `/${searchResultItem.sourceName}` : ''}`;

    return (
        <a href={url} className="resultItemContainer">
            <div className="resultItemContent">
                {searchResultItem.content}
            </div>
            <div className="resultSourceName">
                {sourceName}
            </div>
        </a>
    );
};

export default SearchResultItem;
