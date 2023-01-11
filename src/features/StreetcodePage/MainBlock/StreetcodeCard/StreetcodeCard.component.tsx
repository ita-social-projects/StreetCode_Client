import './StreetcodeCard.styles.scss';
import SimpleSlider from '@features/SlickSlider/SlickSlider.component';
import TagList from '@components/TagList/TagList.component';
import { Button } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';
import Hrushevskyi from '@images/streetcode-card/Hrushevskyi.png';
import useMobx from '@/app/stores/root-store';
import Tag from '@/models/additional-content/tag.model';
import { dateFormatter } from '@/app/common/utils/formatters.utils';
import Streetcode from '@/models/streetcode/streetcode-types.model';


const slide = <img src={Hrushevskyi} className={'streetcodeImg'} alt="" />;

interface Props {
    streetcode?: Streetcode;
}

const formatDate = (date?: Date): string => {
    return dateFormatter.format(date).replace('р.', 'року')
}

const concatDates = (firstDate?: Date, secondDate?: Date): string => {
    let dates: string = '';
    
    if (firstDate) {
        dates += formatDate(new Date(firstDate));
    }

    if (secondDate) {
        dates += ' — ' + formatDate(new Date(secondDate));
    }

    return dates;
}

const StreetcodeCard = ({ streetcode }: Props) => {
    const { modalStore } = useMobx();
    const { setModal } = modalStore;

    return(
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
                            Стріткод #{streetcode?.index}
                        </div>
                        <h2 className={'streetcodeTitle'}>
                            {streetcode?.firstName} {streetcode?.lastName}
                        </h2>
                        <div className={'streetcodeDate'}>
                            {concatDates(streetcode?.eventStartOrPersonBirthDate, 
                                streetcode?.eventEndOrPersonDeathDate)}
                        </div>
                        <TagList tags={streetcode?.tags.map((tag: Tag) => tag.title)}/>
                        <p className={'teaserBlock'}>
                            {streetcode?.teaser}
                        </p>
                        <div className={'cardFooter'}>
                            <Button type="primary" className={'audioBtn'} onClick={()=>setModal('audio')}>
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