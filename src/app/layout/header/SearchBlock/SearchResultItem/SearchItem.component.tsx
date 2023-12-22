import './SearchItem.styles.scss';

import { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';
import { htmlToText } from 'html-to-text';

interface Props {
    searchResultItem: StreetcodeFilterResultDTO;
}

const SearchResultItem = ({ searchResultItem } : Props) => {
    const url = `/${searchResultItem.streetcodeTransliterationUrl
    }${searchResultItem.factId !== 0 ? (`?factId=${searchResultItem.factId}`) : ('')
    }${searchResultItem.timelineItemId !== 0 ? (`?timelineItemId=${searchResultItem.timelineItemId}`) : ('')
    }${searchResultItem.blockName ? (`#${searchResultItem.blockName}`) : ('')}`;

    const sourceName = `Стріткод #${searchResultItem.streetcodeIndex.toString().padStart(4, '0')
    }${searchResultItem.sourceName ? `/${searchResultItem.sourceName}` : ''}`;

    const contentToDisplay = searchResultItem.content ? htmlToText(searchResultItem.content) : '';

    return (
        <a href={url}
        className="resultItemContainer">
            <div className="resultItemContent">
                {contentToDisplay}
            </div>
            <div className="resultSourceName">
                {sourceName}
            </div>
        </a>
    );
};

export default SearchResultItem;
