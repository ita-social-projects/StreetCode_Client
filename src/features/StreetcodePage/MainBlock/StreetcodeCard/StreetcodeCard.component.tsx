import './StreetcodeCard.styles.scss';

import Hrushevskyi from '@images/streetcode-card/Hrushevskyi.png';

import { PlayCircleFilled } from '@ant-design/icons';
import TagList from '@components/TagList/TagList.component';
import SimpleSlider from '@features/SlickSlider/SlickSlider.component';
import Tag from '@models/additional-content/tag.model';
import Streetcode from '@models/streetcode/streetcode-types.model';
import useMobx from '@stores/root-store';
import fullMonthNumericYearDateFmtr from '@utils/formatters.utils';

import { Button } from 'antd';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';

interface Props {
    streetcode?: Streetcode;
}

const formatDate = (date?: Date): string => fullMonthNumericYearDateFmtr.format(date).replace('р.', 'року');

const concatDates = (firstDate?: Date, secondDate?: Date): string => {
    let dates = '';

    if (firstDate) {
        dates += formatDate(new Date(firstDate));
    }

    if (secondDate) {
        dates += ` — ${formatDate(new Date(secondDate))}`;
    }

    return dates;
};

const slide = <img src={Hrushevskyi} className="streetcodeImg" alt="" />;

const StreetcodeCard = ({ streetcode }: Props) => {
    const id = useRouteId();
    const { modalStore: { setModal } } = useMobx();
    const { audiosStore: { fetchAudioByStreetcodeId, Audio } } = useMobx();
    
    useAsync(() => fetchAudioByStreetcodeId(id), [id]);

    return (
        <div className="card">
            <div className="leftSider">
                <div className="leftSiderContentContainer">
                    <div className="leftSiderContent">
                        <SimpleSlider
                            arrows={false}
                            slidesToShow={1}
                            slides={Array(2).fill(slide)}
                            swipeOnClick={false}
                        />
                    </div>
                </div>
            </div>
            <div className="rightSider">
                <div className="headerContainer">
                    <div>
                        <div className="streetcodeIndex">
                            Стріткод #000
                            {streetcode?.index}
                        </div>
                        <h2 className="streetcodeTitle">
                            {streetcode?.firstName}
                            {' '}
                            {streetcode?.lastName}
                        </h2>
                        <div className="streetcodeDate">
                            {concatDates(
                                streetcode?.eventStartOrPersonBirthDate,
                                streetcode?.eventEndOrPersonDeathDate,
                            )}
                        </div>
                        <TagList tags={streetcode?.tags.map((tag: Tag) => tag.title)} />
                        <p className="teaserBlock">
                            {streetcode?.teaser}
                        </p>
                        <div className="cardFooter">
                           {Audio?.url?.href ? 
                                <Button type="primary" className="audioBtn audioBtnActive" onClick={() => setModal('audio')}>
                                    <PlayCircleFilled className="playCircle" />
                                    <span>Прослухати текст</span>
                                </Button> :
                                <Button disabled type="primary" className="audioBtn" onClick={() => setModal('audio')}>
                                    <span>Аудіо на підході</span>
                                </Button>
                            }
                            <Button className="animateFigureBtn">Оживити картинку</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreetcodeCard;