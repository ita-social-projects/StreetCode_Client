import useWindowSize from "@/app/common/hooks/stateful/useWindowSize.hook";
import { useEffect, useRef, useState } from "react";
import './TeamMembers.component.scss'
import BlockSlider from '@/features/SlickSlider/SlickSlider.component';
import Picture from '@/assets/images/about-us/pictureWithBg2.png';
import TeamMemberCard from "../TeamMemberCard/TeamMemberCard.component";
import TeamMemberList from "./TeamMembersList/TeamMemberList.component";
import TeamMember from "@/models/team/team.model";
import TeamApi from "@/app/api/team/team.api";

const TeamMembers = () => { 
    const teamMemberRoles1: TeamMember[] = [
        {
            id: 0,
            isMain: false,
            firstName: 'Roman',
            lastName: 'LAST',
            description: 'Description',
            imageId: 1,
            image: {
                id:1,
                blobName: 'hueta',
                mimeType:'popa',
                base64: Picture
            },
            teamMemberLinks: [],
            positions: [],
        }, 
    ]; 

    const [team, setTeam] = useState<TeamMember[]>([]); 
    useEffect(
        ()=>{
            TeamApi.getByRoleId(1).then(
                result => setTeam(result)
            );
        },
        []
    );

    const stringsArray: String[] = ['string1','string2','stringaaa3','stringgggg4','stringaa5','st6ringggaaaa66',]

    const sliderItems = stringsArray.map(
        (string) => (<div>{string}</div>)
    );
    
    const sliderProps = {
        infinite: true,
        slidesToShow: 3,
        arrows: true,
        centerMode: true,
        dots: false,
    };

    return (
        <div className='aboutUsBlockContainer'>
            <h1><div /><text>тут буде слайдер</text><div /></h1>
            <BlockSlider {...sliderProps}>
                {sliderItems}
            </BlockSlider>
            <TeamMemberList teamMembers = {team} />
        </div>
    );
}
export default TeamMembers; 
