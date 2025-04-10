import './SortButton.styles.scss';

import React from 'react';
import unsortedSortButton from '@assets/images/admin-panel/sort button default.png';
import normalSortButton from '@assets/images/admin-panel/sort button sort1.png';
import reverseSortButton from '@assets/images/admin-panel/sort button sort2.png';

const imageSrc: string = unsortedSortButton;

function onClick() {
    console.log('clicked');
}

const SortButton: React.FC = () => (
    <div className="sort-button">
        <button type="button" onClick={onClick}>
            <img src={imageSrc} alt="sort button" />
        </button>
    </div>
);

export default SortButton;
