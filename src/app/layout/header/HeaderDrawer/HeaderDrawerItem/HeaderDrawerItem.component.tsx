import './HeaderDrawerItem.styles.scss';

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
    id: number;
    text: string;
    parentActive: number;
    link: string;
    toggleState: () => void;
}

const HeaderDrawerItem = ({
    id, parentActive, text, link, toggleState,
}: Props) => {
    const [isActive, setActive] = useState(false);
    const location = useLocation();
    const handleClick = () => {
        toggleState();
    };

    useEffect(() => {
        setActive(location.pathname === link || parentActive === id);
    }, [location, link, parentActive, id]);

    return (
        <Link
            to={link}
            className="headerItem"
            onClick={handleClick}
            id={isActive ? 'active' : ''}
        >
            {text}
        </Link>
    );
};
export default HeaderDrawerItem;
