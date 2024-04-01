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
};

const handleQueryAbort = (queryClient: QueryClient) =>
{
    queryClient.cancelQueries({ queryKey: ['sortedNews', 'image', 'streetcodesMainPage'] });  
}

const handleClick = (queryClient: QueryClient, isStreetcodeSlider: boolean) =>
{
    if(isStreetcodeSlider){
        handleQueryAbort(queryClient);
    }  
}

const CardText = ({
    moreBtnText = 'Трохи ще...', isStreetcodeSlider = false, title, text, subTitle, className, onBtnClick, moreBtnAsLink,  
}:Props) => { 

    const queryClient = useQueryClient();

    return (
    <div className={`cardTextContainer ${className}`}>
        <div className="cardTextContainerTopPart">
            <p className="cardTextContainerTitle">{title}</p>
            {subTitle ? <p className="cardTextContainerSubTitle">{subTitle}</p> : <></>}
            <p className="cardTextContainerText">{text}</p>
        </div>
        {moreBtnAsLink
            ? (
                <Link
                    to={moreBtnAsLink.link}
                    state={moreBtnAsLink.state}
                    className="cardTextContainerButton"
                    onClick = {(e) => handleClick(queryClient, isStreetcodeSlider)}
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
};

export default CardText;
