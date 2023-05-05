import './SearchItem.styles.scss';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';

const BASE_URL = FRONTEND_ROUTES.STREETCODE.BASE;

interface Props {
    searchResultItem: StreetcodeFilterResultDTO;
}

const SearchResultItem = ({ searchResultItem } : Props) => {
    const url = `${BASE_URL}/${searchResultItem.streetcodeTransliterationUrl
    }${searchResultItem.blockName ? (`#${searchResultItem.blockName}`) : ''}`;

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
