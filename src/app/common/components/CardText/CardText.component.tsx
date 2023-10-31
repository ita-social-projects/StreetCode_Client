import './CardText.styles.scss';

import { useEffect } from 'react';

type Props = {
    isMoreBtnOptional?: boolean
    moreBtnText?: string,
    className?: string,
    onBtnClick: any,
    title: string
    subTitle?: string,
    text: string
};

const CardText = ({
    isMoreBtnOptional = false, moreBtnText = 'Трохи ще', title, text, subTitle, className, onBtnClick,
}:Props) => {
    useEffect(() => {

    }, []);

    return (
        <div className={`cardTextContainer ${className}`}>
            <div className="cardTextContainerTopPart">
                <p className="cardTextContainerTitle">{title}</p>
                {subTitle ? <p className="cardTextContainerSubTitle">{subTitle}</p> : <></>}
                <p className="cardTextContainerText">{text}</p>
            </div>

            {!isMoreBtnOptional ? (
                <p
                    className="cardTextContainerButton"
                    onClick={onBtnClick}
                >
                    {moreBtnText}
                </p>
            ) : <></>}
        </div>
    );
};

export default CardText;
