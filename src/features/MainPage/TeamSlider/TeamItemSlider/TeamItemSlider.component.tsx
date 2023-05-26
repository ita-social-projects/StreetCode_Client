import './TeamItemSlider.styles.scss';

import { useEffect, useState } from 'react';
import ImageStore from '@app/stores/image-store';
import facebook from '@assets/images/partners/facebook.png';
import instagram from '@assets/images/partners/instagram.png';
import twitter from '@assets/images/partners/twitter.png';
import youtube from '@assets/images/partners/youtube.png';
import useMobx from '@stores/root-store';

import ImagesApi from '@/app/api/media/images.api';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';

import TeamMember, { Positions } from '../../../../models/team/team.model';

const LogoType = [twitter, instagram, facebook, youtube];
interface Props {
    team?: TeamMember;
}

const TeamItemSlider = ({ team }: Props) => {
    const id = team?.id;
    const [image, setImage] = useState<Image>();
    useEffect(() => {
        if (id) {
            ImagesApi.getById(team.imageId)
                .then((imgs) => setImage(imgs))
                .catch((e) => { });
        }
    }, [team]);

    return (
        <div className="teamItemSlider">
            <div className="itemTeam">
                <div className="leftSlider">
                    <div className="leftSliderContent">
                        <img
                            key={image?.id}
                            src={base64ToUrl(image?.base64, image?.mimeType)}
                            className="teamImg"
                            alt={image?.alt}
                        />
                    </div>
                </div>
                <div className="rightSlider">
                    <div className="headerTeamContainer">
                        <div>
                            <h2 className="teamTitle">
                                {`${team?.firstName} ${team?.lastName}`}
                            </h2>
                            <div className="teamPosition">
                                {team?.positions
                                    .filter((position) => position.position)
                                    .map((position) => (
                                        <span key={position.id}>
                                            {position.position}
                                            {' '}
                                        </span>
                                    ))}
                            </div>
                            <div>
                                <p className="descBlock">
                                    {team?.description}
                                </p>
                            </div>
                            <div key={`${team?.teamMemberLinks.length}${team?.id}${team?.imageId}`} className="teamLinkItems">
                                {team?.teamMemberLinks.map((link) => (
                                    <a
                                        key={`${link.id}${link.targetUrl}`}
                                        rel="noreferrer"
                                        target="_blank"
                                        className="teamLinkItem"
                                        href={link.targetUrl}
                                    >
                                        <img
                                            key={link.id * link.logoType}
                                            src={LogoType[link.logoType]}
                                            alt={link.targetUrl}
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamItemSlider;
