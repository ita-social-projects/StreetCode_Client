import { useQueryClient } from '@tanstack/react-query';
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

function handleQueryAbort()
{
    const queryClient = useQueryClient();
    queryClient.cancelQueries({ queryKey: ['sortedNews', 'image', 'streetcodesMainPage'] });
}

const CardText = ({
    moreBtnText = 'Трохи ще...', isStreetcodeSlider = false, title, text, subTitle, className, onBtnClick, moreBtnAsLink,  
}:Props) => (
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
                    onClick = {(e) => {
                        if(isStreetcodeSlider) {
                            handleQueryAbort();
                        }
                    }}
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

export default CardText;
