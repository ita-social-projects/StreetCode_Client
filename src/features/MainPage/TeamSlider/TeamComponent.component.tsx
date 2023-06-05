import './TeamComponent.styles.scss';

import TeamApi from '@/app/api/team/team.api';
import TeamMember from '@/models/team/team.model';
import TeamItemSlider from './TeamItemSlider/TeamItemSlider.component';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useState, useEffect } from 'react';
import SlickSlider from './../../SlickSlider/SlickSlider.component'
import Heading from '../Heading/Heading.component';
const TeamComponent = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await TeamApi.getAllMain();
                setTeam(response);
            } catch (error) {
            }
        };

        fetchTeamMembers();
    }, []);
    const props = {
        touchAction: 'pan-y',
        touchThreshold: 25,
        transform: 'translateZ(0)',
        arrows:false,
        dots:false,
        infinite:true,
        variableWidth: true,
        slidesToShow: 1,
        swipeOnClick: false
    }
    
    const handleClick = () => {
        window.location.assign('https://www.instagram.com/streetcodeua/');
    }
        return (
            (team.length > 0)
            ? (
            <div id="mainBlock" className="teamComponent">
                <Heading blockName='Команда' buttonName='Вся команда' setActionOnClick={handleClick}/>
                <div className="mainContainer">
                    <div className="blockCentering">
                        <div className="mainContent">
                            <SlickSlider
                                {...props}
                            >
                                {team.map((member) =>
                                    <div key={member.id} className="slider-item">
                                        <TeamItemSlider team={member} />
                                    </div>
                                )}
                            </SlickSlider>
                        </div>
                    </div>
                </div>
            </div >
           ) : <></>
        );
};

export default TeamComponent;
