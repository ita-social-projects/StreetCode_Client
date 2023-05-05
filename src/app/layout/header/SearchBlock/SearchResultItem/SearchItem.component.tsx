import './SearchItem.styles.scss';

import { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';

const BASE_URL = 'http://localhost:3000/streetcode/';

interface Props {
    searchResultItem: StreetcodeFilterResultDTO;
}

const SearchResultItem = ({ searchResultItem } : Props) => {
    const url = BASE_URL + searchResultItem.streetcodeTransliterationUrl
        + (searchResultItem.blockName && searchResultItem.blockName.trim().length > 0
            ? (`#${searchResultItem.blockName}`) : '');

    const sourceName = `Стріткод #${searchResultItem.streetcodeIndex.toString().padStart(4, '0')}${searchResultItem.sourceName ? `/${searchResultItem.sourceName}` : ''}`;

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
