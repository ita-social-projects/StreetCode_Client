import './TeamItemSlider.styles.scss';

import behance from '@assets/images/partners/behance.svg';
import facebook from '@assets/images/partners/facebook.svg';
import http from '@assets/images/partners/http.svg';
import instagram from '@assets/images/partners/instagram.svg';
import linkedin from '@assets/images/partners/linkedin.svg';
import tiktok from '@assets/images/partners/tiktok.svg';
import twitter from '@assets/images/partners/twitterNew.svg';
import youtube from '@assets/images/partners/youtube.svg';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';

import TeamMember from '../../../../models/team/team.model';

interface Props {
    team?: TeamMember;
    image: Image
}

const TeamItemSlider = ({ team, image }: Props) => {
    const windowsize = useWindowSize();
    const LogoType = [twitter, instagram, facebook, youtube, linkedin, tiktok, behance, http];

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
                            <h2 className="teamItemTitle">
                                {`${team?.name}`}
                            </h2>
                            <div>
                                <p className="teamItemDescription">
                                    {team?.description}
                                </p>
                            </div>
                            <div
                                key={`${team?.teamMemberLinks.length}${team?.id}${team?.imageId}`}
                                className="teamLinkItems"
                            >
                                {team?.teamMemberLinks.map((link, index) => {
                                    const LogoComponent = LogoType[link.logoType];
                                    return (
                                        <a
                                            key={`${link.id}${link.targetUrl}`}
                                            rel="noreferrer"
                                            target="_blank"
                                            className={index === 0 ? 'firstTeamLinkItem' : 'teamLinkItem'}
                                            href={link.targetUrl}
                                        >
                                            <LogoComponent />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamItemSlider;
