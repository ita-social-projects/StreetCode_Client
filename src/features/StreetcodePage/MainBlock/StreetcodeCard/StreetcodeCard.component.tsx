import './StreetcodeCard.styles.scss';
import SimpleSlider from '@features/SlickSlider/SlickSlider.component';
import TagList from '@components/TagList/TagList.component';
import { Button } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';
import Hrushevskyi from '@images/streetcode-card/Hrushevskyi.png';
import useMobx from '@/app/stores/root-store';
import Tag from '@/models/additional-content/tag.model';
import { formatDates } from '@/app/common/utils/dateFormatter/dateFormatter.utils';


const slide = <img src={Hrushevskyi} className={'streetcodeImg'} alt="" />;

interface Props {
    streetcodeId: number;
}

const StreetcodeCard = ({ streetcodeId }: Props) => {
    const { streetcodesStore: { StreetcodeMap } } = useMobx();

    return (
        <div className={'card'}>
            <div className={'leftSider'}>
                <div className={'leftSiderContentContainer'}>
                    <div className={'leftSiderContent'}>
                        <SimpleSlider
                            arrows={false}
                            slidesToShow={1}
                            slides={Array(4).fill(slide)}
                            swipeOnClick={false}
                        />
                    </div>
                </div>
            </div>
            <div className={'rightSider'}>
                <div className={'headerContainer'}>
                    <div>
                        <div className={'streetcodeIndex'}>
                            Стріткод #{StreetcodeMap.get(streetcodeId)?.index}
                        </div>
                        <h2 className={'streetcodeTitle'}>
                            {StreetcodeMap.get(streetcodeId)?.firstName} {StreetcodeMap.get(streetcodeId)?.lastName}
                        </h2>
                        <div className={'streetcodeDate'}>
                            {formatDates(StreetcodeMap.get(streetcodeId)?.eventStartOrPersonBirthDate, 
                                StreetcodeMap.get(streetcodeId)?.eventEndOrPersonDeathDate)}
                        </div>
                        <TagList tags={StreetcodeMap.get(streetcodeId)?.tags.map((tag: Tag) => tag.title)}/>
                        <p className={'teaserBlock'}>
                            {StreetcodeMap.get(streetcodeId)?.teaser}
                        </p>
                        <div className={'cardFooter'}>
                            <Button type="primary" className={'audioBtn'}>
                                <PlayCircleFilled className={'playCircle'}/>
                                <span>Прослухати текст</span>
                            </Button>
                            <Button className={'animateFigureBtn'}>Оживити постать</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default StreetcodeCard;