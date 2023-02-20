import './HeaderDrawerItem.styles.scss';

import React, { useEffect, useState } from 'react';

interface Props {
    id: number;
    text: string;
    parentActive: number;
    setParentActive: React.Dispatch<React.SetStateAction<number>>;
}

const HeaderDrawerItem = ({ id, parentActive, setParentActive, text }: Props) => {
    const [isActive, setActive] = useState(false);
    const handleClick = () => {
        setParentActive(id);
        setActive(true);
    };
    useEffect(() => {
        if (parentActive !== id) {
            setActive(false);
        }
    }, [id, parentActive]);
    return (
        <div>
            <button
                className="headerItem"
                onClick={handleClick}
                type="button"
                id={isActive ? 'active' : ''}
            >
                {text}
            </button>
        </div>
    );
};
export default HeaderDrawerItem;
