import './RelatedFigures.styles.scss';

import Antonovich from '@images/related-figures/Antonovich.png';
import Khmelnytsky from '@images/related-figures/Khmelnytsky.png';
import Mazepa from '@images/related-figures/Mazepa.png';
import Ratushny from '@images/related-figures/Ratushny.png';
import Ukrainka from '@images/related-figures/Ukrainka.png';

import { forwardRef } from 'react';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import RelatedFigureItem from '@streetcode/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';

import RelatedFigure from '@/models/streetcode/related-figure.model';

const relatedFigures: RelatedFigure[] = [
    {
        id: 1,
        title: 'Володимир Антонович',
        image: { id: 1, url: { id: 1, href: Antonovich } },
        tags: [{ id: 1, title: 'Наукова школа' }, { id: 1, title: 'tag' }],
    },
    {
        id: 2,
        title: 'Леся Українка',
        image: { id: 1, url: { id: 1, href: Ukrainka } },
        tags: [{ id: 1, title: 'tag' }],
    },
    {
        id: 3,
        title: 'Іван Мазепа',
        image: { id: 1, url: { id: 1, href: Mazepa } },
        tags: [{ id: 1, title: 'tag' }],
    },
    {
        id: 4,
        title: 'Роман Ратушний',
        image: { id: 1, url: { id: 1, href: Ratushny } },
        tags: [{ id: 1, title: 'tag' }],
    },
    {
        id: 5,
        title: 'Богдан хмельницький',
        image: { id: 1, url: { id: 1, href: Khmelnytsky } },
        tags: [{ id: 1, title: 'tag' }],
    },
];

const RelatedFiguresComponent = () => {
    const { modalStore: { setModal } } = useMobx();
    // const { relatedFiguresStore } = useMobx();
    // const { fetchRelatedFiguresByStreetcodeId, getRelatedFiguresArray } = relatedFiguresStore;

    /* const streetcodeId = useRouteId();
    useAsync(
        () => fetchRelatedFiguresByStreetcodeId(streetcodeId),
        [streetcodeId],
    );
     */

    const sliderItems = relatedFigures.map((figure) => (
        <RelatedFigureItem
            key={figure.id}
            relatedFigure={figure}
        />
    ));

    return (
        <div
            id="relatedFigures"
            className={`relatedFiguresWrapper ${(relatedFigures.length > 4 ? 'bigWrapper' : 'smallWrapper')}`}
        >
            <div className="relatedFiguresContainer">
                <BlockHeading headingText="Зв'язки історії" />
                <div className="relatedFiguresSliderContainer">
                    <div style={{ height: '100%' }}>
                        <SlickSlider
                            className="heightContainer"
                            infinite={false}
                            slidesToShow={4}
                            slides={sliderItems}
                            swipe={false}
                            dots={false}
                        />
                    </div>
                </div>
                <div className="moreInfo">
                    <p onClick={() => setModal('relatedFigures', undefined, true)}>
                        Дивитися всіх
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RelatedFiguresComponent;
