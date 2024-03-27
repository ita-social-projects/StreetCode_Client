import { useQueryClient } from '@tanstack/react-query';
import './CardText.styles.scss';
import { useState } from 'react';

import { Link } from 'react-router-dom';

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

function handleQueryAbort()
{
    const queryClient = useQueryClient();
    queryClient.cancelQueries({ queryKey: ['sortedNews', 'image', 'streetcodesMainPage'] });   
}

const handleOnClick = (isStreetcodeSlider: boolean) =>
{
    if(isStreetcodeSlider) {
        handleQueryAbort();
    } 
}

const CardText = ({
    isInterestingFact = false, isStreetcodeSlider = false, moreBtnText, title, text, subTitle, className, onBtnClick, moreBtnAsLink,
}:Props) => {
    const [isCopied, setIsCopied] = useState(false);

    const clickHandle = async () => {
        if(text) {
            await navigator.clipboard.writeText(text);
        }
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
            {isCopied && <div className="CoppyMessage">Скопійовано </div>}
        </div>
        {isInterestingFact ? <></> :
            moreBtnAsLink ? (
                <Link
                    to={moreBtnAsLink.link}
                    state={moreBtnAsLink.state}
                    className="cardTextContainerButton"
                    onClick = {() => handleOnClick(isStreetcodeSlider)}
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
            )
        }
    </div>);
    }

export default CardText;
