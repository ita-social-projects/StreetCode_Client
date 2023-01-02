import "./Sources.styles.scss"

import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import SourcesSlideItem from "./SourceItem/SourceItem.component";
import BlockHeading from "@features/BlockHeading/BlockHeading.component";
import SourcesModal from "@common/components/modals/SourcesModal.component";

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
                                dots={false}
                                autoplay
                                swipe={false}
                                autoplaySpeed={5e3}
                                slides={slides}
                            />
                            <p className={"seeMoreBtn"}>Дивитися всі</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SourcesComponent;