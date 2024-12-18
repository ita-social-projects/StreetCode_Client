import './SearchBlock.styles.scss';

import StreetcodeFilterRequestDTO, { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';

import SearchResultItem from './SearchResultItem/SearchItem.component';

interface Props {
    searchResult: StreetcodeFilterResultDTO[];
    onSearchResultItemClick?: React.MouseEventHandler<HTMLAnchorElement>;
}
const SearchBlock = ({ searchResult, onSearchResultItemClick } : Props) => {
    const blockHeight = searchResult.length > 9 ? '418px' : '100%';

    return (
        <div className="searchResultsBlock" style={{ height: blockHeight }}>
            {searchResult.length === 0 ? <p>Результатів немає</p>
                : (searchResult.map((searchResultItem: StreetcodeFilterResultDTO, index) => (
                    <SearchResultItem key={index} searchResultItem={searchResultItem} onClick={onSearchResultItemClick} />
                )))}
        </div>
    );
};

export default SearchBlock;
