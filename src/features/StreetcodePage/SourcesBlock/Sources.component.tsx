import "./Sources.styles.scss";

import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import SourcesSlideItem from "./SourceItem/SourceItem.component";
import BlockHeading from "@streetcode/HeadingBlock/BlockHeading.component";
import SourcesModal from "@components/modals/Sources/SourcesModal.component";

interface Props {

}

const SourcesComponent = (props: Props) => {
    const slides = ["Книги", "Статті", "Фільми", "Постаті"].map(text => (
        <SourcesSlideItem text={text} />
    ));

    return (
        <>
            <div className={"sourcesWrapper"}>
                <SourcesModal />
                <div className={"sourcesContainer"}>
                    <BlockHeading headingText={"Для фанатів"} />
                    <div className={"sourceContentContainer"}>
                        <div className={"sourcesSliderContainer"}>
                            <SlickSlider
                                swipeOnClick={false}
                                dots={false}
                                autoplay
                                swipe={false}
                                autoplaySpeed={5e3}
                                slides={slides}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SourcesComponent;