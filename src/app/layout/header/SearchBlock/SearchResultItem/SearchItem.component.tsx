import './SearchItem.styles.scss';

import { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';

interface Props {
    searchResultItem: StreetcodeFilterResultDTO;
}

const SearchResultItem = ({ searchResultItem } : Props) => (
    <a href={searchResultItem.streetcodeUrl} className="resultItemContainer">
        <div className="resultItemContent">
            {searchResultItem.content}
        </div>
        <div className="resultSourceName">
            {searchResultItem.sourceName}
        </div>
    </a>
);

export default SearchResultItem;
