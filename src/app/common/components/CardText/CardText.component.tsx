import './CardText.styles.scss';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

type Props = {
    moreBtnText?: string,
    moreBtnAsLink?: { link: string, state: any },
    className?: string,
    onBtnClick?: (event: any) => void,
    title: string
    subTitle?: string,
    text: string
    isStreetcodeSlider?: boolean
    isInterestingFact?: boolean
};

function HandleQueryAbort(queryClient: QueryClient) {
    queryClient.cancelQueries({ queryKey: ['news', 'image', 'streetcodesMainPage'] });
}

const handleOnClick = (queryClient: QueryClient, isStreetcodeSlider: boolean) => {
    if (isStreetcodeSlider) {
        HandleQueryAbort(queryClient);
    }
};

const CardText = ({
    isInterestingFact = false,
    isStreetcodeSlider = false, moreBtnText, title, text, subTitle, className, onBtnClick, moreBtnAsLink,
}:Props) => {
    const queryClient = useQueryClient();
    const [isCopied, setIsCopied] = useState(false);

    const ClickHandle = async () => {
        if (text) {
            await navigator.clipboard.writeText(text);
        }
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <div className={`cardTextContainer ${className}`}>
            <div className="cardTextContainerTopPart" onClick={ClickHandle} role="presentation">
                <p className="cardTextContainerTitle">{title}</p>
                {subTitle ? <p className="cardTextContainerSubTitle">{subTitle}</p> : <></>}
                <p className="cardTextContainerText">{text}</p>
                {isCopied && <div className="CoppyMessage">Скопійовано </div>}
            </div>
            {isInterestingFact ? <></>
                : moreBtnAsLink ? (
                    <Link
                        to={moreBtnAsLink.link}
                        state={moreBtnAsLink.state}
                        className="cardTextContainerButton"
                        onClick={() => handleOnClick(queryClient, isStreetcodeSlider)}
                    >
                        {moreBtnText}

                    </Link>
                ) : (
                    <p
                        className="cardTextContainerButton"
                        onClick={onBtnClick}
                    >
                        {moreBtnText}
                    </p>
                )}
        </div>
    );
};

export default CardText;
