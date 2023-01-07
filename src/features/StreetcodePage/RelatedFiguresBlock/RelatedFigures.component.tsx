import './RelatedFigures.styles.scss';

import Antonovich from '@images/related-figures/Antonovich.png';
import Ukrainka from '@images/related-figures/Ukrainka.png';
import Mazepa from '@images/related-figures/Mazepa.png';
import Ratushny from '@images/related-figures/Ratushny.png';
import Khmelnytsky from '@images/related-figures/Khmelnytsky.png';

import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import RelatedFigure from '@models/streetcode/related-figure.model';
import RelatedFigureItem from '@streetcode/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem';

interface Props {

}

const relatedFigures: RelatedFigure[] = [
    {
        Id: 1,
        Title: 'Володимир Антонович',
        Image: { id: 1, url: { id: 1, href: Antonovich } },
        Tags: [{ id: 1, title: 'Наукова школа' }, { id: 1, title: 'tag' }]
    },
    {
        Id: 2,
        Title: 'Леся Українка',
        Image: { id: 1, url: { id: 1, href: Ukrainka } },
        Tags: [{ id: 1, title: 'tag' }]
    },
    {
        Id: 3,
        Title: 'Іван Мазепа',
        Image: { id: 1, url: { id: 1, href: Mazepa } },
        Tags: [{ id: 1, title: 'tag' }]
    },
    {
        Id: 4,
        Title: 'Роман Ратушний',
        Image: { id: 1, url: { id: 1, href: Ratushny } },
        Tags: [{ id: 1, title: 'tag' }]
    },
    {
        Id: 5,
        Title: 'Богдан хмельницький',
        Image: { id: 1, url: { id: 1, href: Khmelnytsky } },
        Tags: [{ id: 1, title: 'tag' }]
    }
];

const RelatedFiguresComponent = (props: Props) => {
    const sliderItems = relatedFigures.map(figure => (
        <RelatedFigureItem
            key={figure.Id}
            id={figure.Id}
            textContent={figure.Title}
            imgSrc={figure.Image.url.href}
            tags={figure.Tags}
        />
    ));

    return (
        <div
            className={'relatedFiguresWrapper ' + (relatedFigures.length > 4 ? 'bigWrapper' : 'smallWrapper')}>
            <div className="relatedFiguresContainer">
                <BlockHeading headingText="Зв'язки історії"/>
                <div className={'relatedFiguresSliderContainer'}>
                    <div style={{ height: '100%' }}>
                        <SlickSlider
                            className={'heightContainer'}
                            slidesToShow={4}
                            slides={sliderItems}
                            swipe={false}
                            dots={false}
                            swipeOnClick={false}
                        />
                    </div>
                </div>
                <div className="moreInfo">
                    <p>Дивитися всіх</p>
                </div>
            </div>
        </div>
    );
}

export default RelatedFiguresComponent;