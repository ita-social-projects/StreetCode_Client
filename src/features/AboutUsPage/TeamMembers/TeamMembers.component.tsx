import { useEffect,  useRef,  useState } from "react";
import './TeamMembers.component.scss'
import TeamMemberCard from "../TeamMemberCard/TeamMemberCard.component";
import TeamMember from "@/models/team/team.model";
import TeamMemberList from "./TeamMembersList/TeamMemberList.component";
import TeamApi from "@/app/api/team/team.api";
import '@/app/common/constants/screen-sizes.constants'

import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css';
import 'swiper/css/pagination';
import { SCREEN_SIZES } from "@/app/common/constants/screen-sizes.constants";

const TeamMembers = () => { 
    const [team, setTeam] = useState<TeamMember[]>([]); 
    
    useEffect(
        ()=>{
            TeamApi.getByRoleId(1).then(
                result => setTeam(result)
            ).then();
        },
        []
    );

    const getSliderData = () => {
        if(team.length > 0){
            return(
                <Swiper
                    slidesPerView = "auto"
                    centeredSlides
                    spaceBetween={20}
                    slideToClickedSlide
                    pagination = {window.innerWidth < SCREEN_SIZES.phone}
                    loop = {true}
                    >
                        {team.map(
                        (member) => (                    
                            <SwiperSlide >
                                <TeamMemberCard {...member}/>
                            </SwiperSlide>
                ))}
                </Swiper>
            )
        }
        return (<></>);
    };

    return (
        <div className='aboutUsBlockContainer'>
            { window.innerWidth < SCREEN_SIZES.tablet
                ? 
                    <div className="teamMembersSlider">
                        {
                            getSliderData()
                        }    
                    </div>
                : <TeamMemberList teamMembers = {team}/>
            }
    </div>
    );
}
export default TeamMembers; 
