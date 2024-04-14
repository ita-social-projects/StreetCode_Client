import { QueryClient, useQueryClient } from '@tanstack/react-query';
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
    isStreetcodeSlider?: boolean
    isInterestingFact?: boolean
};

function handleQueryAbort(queryClient: QueryClient)
{
    queryClient.cancelQueries({ queryKey: ['news', 'image', 'streetcodesMainPage'] });   
}

const handleOnClick = (queryClient: QueryClient, isStreetcodeSlider: boolean) =>
{
    if(isStreetcodeSlider) {
        handleQueryAbort(queryClient);
    } 
}

const CardText = ({
    isInterestingFact = false, isStreetcodeSlider = false, moreBtnText, title, text, subTitle, className, onBtnClick, moreBtnAsLink,
}:Props) => {

    const queryClient = useQueryClient();

    return (
    <div className={`cardTextContainer ${className}`}>
        <div className="cardTextContainerTopPart">
            <p className="cardTextContainerTitle">{title}</p>
            {subTitle ? <p className="cardTextContainerSubTitle">{subTitle}</p> : <></>}
            <p className="cardTextContainerText">{text}</p>
        </div>
        {isInterestingFact ? <></> :
            moreBtnAsLink ? (
                <Link
                    to={moreBtnAsLink.link}
                    state={moreBtnAsLink.state}
                    className="cardTextContainerButton"
                    onClick = {() => handleOnClick(queryClient, isStreetcodeSlider)}
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
    </div>
);
};

export default CardText;
