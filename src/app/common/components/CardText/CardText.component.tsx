import { useState } from 'react';
import './CardText.styles.scss';

import { Link } from 'react-router-dom';

type Props = {
    moreBtnText?: string,
    moreBtnAsLink?: { link: string, state: any },
    className?: string,
    onBtnClick?: (event: any) => void,
    title: string
    subTitle?: string,
    text: string
};


const CardText = ({
    moreBtnText = 'Трохи ще...', title, text, subTitle, className, onBtnClick, moreBtnAsLink,
}: Props) => {
    const [isCopied, setIsCopied] = useState(false);

    const clickHandle = async () => {
        text ? await navigator.clipboard.writeText(text) : null;
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <div className={`cardTextContainer ${className}`}>
            <div className="cardTextContainerTopPart" onClick={clickHandle} role="presentation">
                <p className="cardTextContainerTitle">{title}</p>
                {subTitle ? <p className="cardTextContainerSubTitle">{subTitle}</p> : <></>}
                <p className="cardTextContainerText">{text}</p>
                {isCopied && <div className="CoppyMessage">Скопійовано  </div>}
            </div>
            {moreBtnAsLink
                ? (
                    <Link
                        to={moreBtnAsLink.link}
                        state={moreBtnAsLink.state}
                        className="cardTextContainerButton"
                    >
                        {moreBtnText}
                    </Link>
                )
                : (
                    <p
                        className="cardTextContainerButton"
                        onClick={onBtnClick}
                    >
                        {moreBtnText}
                    </p>
                )}

        </div>
    );
}

export default CardText;
