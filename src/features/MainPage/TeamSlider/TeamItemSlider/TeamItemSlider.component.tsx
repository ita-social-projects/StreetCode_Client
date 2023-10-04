import './TeamItemSlider.styles.scss';

import { useEffect, useState } from 'react';
import ImageStore from '@app/stores/image-store';
import facebook from '@assets/images/partners/facebook.webp';
import instagram from '@assets/images/partners/instagram.webp';
import twitter from '@assets/images/partners/twitter.webp';
import youtube from '@assets/images/partners/youtube.webp';
import useMobx from '@stores/root-store';

import ImagesApi from '@/app/api/media/images.api';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';

import TeamMember, { Positions } from '../../../../models/team/team.model';

const LogoType = [twitter, instagram, facebook, youtube];
interface Props {
    team?: TeamMember;
    image: Image
}

const TeamItemSlider = ({ team, image }: Props) => {
    const windowsize = useWindowSize();

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
                        <div className="textContainer">
                            <h2 className="teamTitle">
                                {`${team?.name}`}
                            </h2>
                            <div className="teamPosition">
                                {team?.description}
                            </div>
                            {windowsize.width > 1024 && (
                                <>
                                    <div>
                                        <p className="descBlock">
                                            {team?.description}
                                        </p>
                                    </div>
                                    <div
                                        key={`${team?.teamMemberLinks.length}${team?.id}${team?.imageId}`}
                                        className="teamLinkItems"
                                    >
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamItemSlider;
