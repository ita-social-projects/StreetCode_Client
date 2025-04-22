import './SortButton.styles.scss';

import unsortedSortButton from '@images/admin-panel/sort-button-default.png';
import ascendSortButton from '@images/admin-panel/sort-button-sort1.png';
import descendSortButton from '@images/admin-panel/sort-button-sort2.png';

import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { SortDirection } from '@features/AdminPage/SortButton/useSortDirection';

const images = [
    unsortedSortButton,
    ascendSortButton,
    descendSortButton,
];

export interface SortButtonHandle {
    resetImage: () => void;
    changeImage: (sortDirection: SortDirection) => void;
}

interface SortButtonProps {
    sortOnClick: () => void;
}

const SortButton: React.FC<SortButtonProps> = forwardRef<SortButtonHandle, SortButtonProps>(
    ({ sortOnClick }, ref) => {
        const [imageIndex, setImageIndex] = useState(0);

        function resetImage() {
            setImageIndex(0);
        }

        function changeImage(sortDirection: SortDirection) {
            setImageIndex(() => sortDirection as number);
        }

        useImperativeHandle(ref, () => ({
            resetImage,
            changeImage,
        }));

        return (
            <div className="sort-button">
                <button
                    type="button"
                    onClick={() => {
                        sortOnClick();
                    }}
                >
                    <img src={images[imageIndex]} alt="sort button" />
                </button>
            </div>
        );
    },
);

export default React.memo(SortButton) as React.MemoExoticComponent<
    React.ForwardRefExoticComponent<
        SortButtonProps & React.RefAttributes<SortButtonHandle>
    >
>;
