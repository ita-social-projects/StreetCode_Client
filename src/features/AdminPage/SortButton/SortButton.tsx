import './SortButton.styles.scss';

import unsortedSortButton from '@images/admin-panel/sort button default.png';
import ascendSortButton from '@images/admin-panel/sort button sort1.png';
import descendSortButton from '@images/admin-panel/sort button sort2.png';

import React, { useState } from 'react';
import { SortDirection } from '@features/AdminPage/SortButton/useSortDirection';

const images = [
    unsortedSortButton,
    ascendSortButton,
    descendSortButton,
];

interface SortButtonProps {
    previousSortDirection: SortDirection;
    sortOnClick: () => void;
}

const SortButton: React.FC<SortButtonProps> = ({ previousSortDirection, sortOnClick }) => {
    const [imageIndex, setImageIndex] = useState(0);

    function changeImageOnClick() {
        setImageIndex(() => (previousSortDirection as number + 1) % images.length);
    }

    return (
        <div className="sort-button">
            <button
                type="button"
                onClick={() => {
                    sortOnClick();
                    changeImageOnClick();
                }}
            >
                <img src={images[imageIndex]} alt="sort button" />
            </button>
        </div>
    );
};

export default SortButton;
