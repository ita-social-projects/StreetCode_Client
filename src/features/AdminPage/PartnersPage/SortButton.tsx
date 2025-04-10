import './SortButton.styles.scss';

import React, { useState } from 'react';
import unsortedSortButton from '@assets/images/admin-panel/sort button default.png';
import ascendSortButton from '@assets/images/admin-panel/sort button sort1.png';
import descendSortButton from '@assets/images/admin-panel/sort button sort2.png';

const images = [
    unsortedSortButton,
    ascendSortButton,
    descendSortButton,
];

export enum SortDirection {
    Unsorted,
    Ascend,
    Descend,
}

interface SortButtonProps {
    sortOnClick: () => void;
}

const SortButton: React.FC<SortButtonProps> = ({ sortOnClick }) => {
    const [imageIndex, setImageIndex] = useState(0);

    function changeImageOnClick() {
        setImageIndex((prev) => (prev + 1) % images.length);
    }

    return (
        <div className="sort-button">
            <button
                type="button"
                onClick={() => {
                    changeImageOnClick();
                    sortOnClick();
                }}
            >
                <img src={images[imageIndex]} alt="sort button" />
            </button>
        </div>
    );
};

export default SortButton;
