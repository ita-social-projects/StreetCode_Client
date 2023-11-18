import './CardText.styles.scss';

import { useEffect, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';

type Props = {
    moreBtnText?: string,
    className?: string,
    onBtnClick: any,
    title: string
    subTitle?: string,
    text: string
};

const CardText = ({
    moreBtnText = 'Трохи ще...', title, text, subTitle, className, onBtnClick,
}:Props) => (
    <div className={`cardTextContainer ${className}`}>
        <div className="cardTextContainerTopPart">
            <p className="cardTextContainerTitle">{title}</p>
            {subTitle ? <p className="cardTextContainerSubTitle">{subTitle}</p> : <></>}
            <p className="cardTextContainerText">{text}</p>
        </div>
        <p
            className="cardTextContainerButton"
            onClick={onBtnClick}
        >
            {moreBtnText}
        </p>
    </div>
);

export default CardText;
