import "./InterestingFacts.styles.scss"
import WowFactImg from "@images/interesting-facts/WowFacts1.png";
import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import BlockHeading from "@streetcode/HeadingBlock/BlockHeading.component";
import InterestingFactItem from '@streetcode/InterestingFactsBlock/InterestingFactItem/InterestingFactItem.component';
import useMobx from "@stores/root-store";
import {useAsync} from "@hooks/stateful/useAsync.hook";
import {useParams} from "react-router-dom";


const InterestingFactsComponent = () => {
    const streetcodeId = useParams<{id: string}>();
    const id = parseInt(streetcodeId.id ?? "1");
    const{factsStore:{fetchFactsByStreetcodeId, getFactArray}} = useMobx();
    const { value } = useAsync(
        () => fetchFactsByStreetcodeId(id)
    );

    let sliderItems = [...getFactArray.map(title => (
        <InterestingFactItem textHeading={title.title}  mainText={title.factContent} imgSrc={WowFactImg} factId={title.id}/>
    ))];

    const showDots = sliderItems.length > 3;

    if (sliderItems.length >= 2) {
        const maxSlidesToShow = 3;
        while (sliderItems.length <= maxSlidesToShow) {
            sliderItems = sliderItems.concat(sliderItems);
        }
    }

    return (
        <div className='interestingFactsWrapper'>
            <div className='interestingFactsContainer'>
                <BlockHeading headingText='Wow-факти' />
                <div className='interestingFactsSliderContainer'>
                    <div style={{height: "100%"}}>
                        { (sliderItems.length === 1)
                            ? (
                                <div className={"singleSlideContainer"}>
                                    <InterestingFactItem
                                        factId={sliderItems[0].props.factId}
                                        imgSrc={sliderItems[0].props.imgSrc}
                                        mainText={sliderItems[0].props.mainText}
                                        maxTextLength={300}
                                        textHeading={sliderItems[0].props.textHeading}
                                    />
                                </div>
                            ) : (
                                <SlickSlider
                                    swipeOnClick={true}
                                    className='heightContainer'
                                    slides={sliderItems}
                                    slidesToShow={3}
                                    centerMode={true}
                                    swipe={false}
                                    dots={showDots}
                                    centerPadding={"-12px"}
                                />
                            )
                        }


                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterestingFactsComponent;