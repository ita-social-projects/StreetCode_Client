import './SearchItem.styles.scss';

import { Link } from 'react-router-dom';
import { htmlToText } from 'html-to-text';

import { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';

interface Props {
    searchResultItem: StreetcodeFilterResultDTO;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const SearchResultItem = ({ searchResultItem, onClick } : Props) => {
    const url = `/${searchResultItem.streetcodeTransliterationUrl
    }${searchResultItem.factId !== 0 ? (`?factId=${searchResultItem.factId}`) : ('')
    }${searchResultItem.timelineItemId !== 0 ? (`?timelineItemId=${searchResultItem.timelineItemId}`) : ('')
    }${searchResultItem.blockName ? (`#${searchResultItem.blockName}`) : ('')}`;

    const sourceName = `History-код #${searchResultItem.streetcodeIndex.toString().padStart(4, '0')
    }${searchResultItem.sourceName ? `/${searchResultItem.sourceName}` : ''}`;

    const contentToDisplay = searchResultItem.content ? htmlToText(searchResultItem.content) : '';

    return (
        <Link
            to={url}
            className="resultItemContainer"
            onClick={onClick}
        >
            <div className="resultItemContent">
                {contentToDisplay}
            </div>
            <div className="resultSourceName">
                {sourceName}
            </div>
        </Link>
    );
};

export default SearchResultItem;
