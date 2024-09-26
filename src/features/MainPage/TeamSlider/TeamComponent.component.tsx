import './TeamComponent.styles.scss';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImagesApi from '@api/media/images.api';
import NewsApi from '@api/news/news.api';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Image from '@models/media/image.model';

import TeamApi from '@/app/api/team/team.api';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import TeamMember from '@/models/team/team.model';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import SlickSlider from '../../SlickSlider/SlickSlider.component';
import Heading from '../Heading/Heading.component';

import TeamItemSlider from './TeamItemSlider/TeamItemSlider.component';

const TeamComponent = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const navigate = useNavigate();

    const props = {
        touchAction: 'pan-y',
        touchThreshold: 25,
        transform: 'translateZ(0)',
        arrows: true,
        centerMode: false,
        centerPadding: '-5px',
        dots: false,
        infinite: true,
        variableWidth: true,
        slidesToShow: 1,
        swipeOnClick: false,
    };

    const windowsize = useWindowSize();
    if (windowsize.width <= 1024) {
        props.arrows = false;
        props.dots = true;
        if (windowsize.width >= 768) props.centerMode = true;
    }

    const handleButtonClick = () => {
        navigate('../about-us');
    };

    useAsync(async () => {
        try {
            const response = await TeamApi.getAllMain();
            setTeam(response);

            const newImages : Image[] = [];
            for (const teammate of response) {
                await ImagesApi.getById(teammate.imageId)
                    .then((img) => {
                        newImages.push(img);
                        setImages(newImages);
                    });
            }
        } catch (error) {}
    });

    return (
        (team.length > 0)
            ? (
                <div id="mainBlock" className="teamComponent">
                    <Heading blockName="Команда" buttonName="Вся команда" setActionOnClick={handleButtonClick} />
                    <div className="mainContainer">
                        <div className="blockCenter">
                            <div className="mainContent">
                                <SlickSlider
                                    secondPreset
                                    {...props}
                                >
                                    {team.map((member, index) => (
                                        <div key={member.id} className="slider-item">
                                            <TeamItemSlider team={member} image={images[index]} />
                                        </div>
                                    ))}
                                </SlickSlider>
                            </div>
                        </div>
                        {windowsize.width <= 480
                            && (
                                <button className="redirectButton" onClick={handleButtonClick}>
                                Побачити всю команду
                                </button>
                            )}
                    </div>
                </div>
            ) : <></>
    );
};

export default TeamComponent;
