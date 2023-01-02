import "./Streetcode.styles.scss"

import SourcesComponent from "@features/SourcesBlock/Sources.component"
import InterestingFactsComponent from "../InterestingFacts/InterestingFacts.component"
import QRComponent from "../QRBlock/QR.component"
import MainBlock from "@features/MainBlock/MainBlock.component";
import TextComponent from "@features/TextBlock/Text.component";
import RelatedFiguresComponent from "@/features/RelatedFiguresBlock/RelatedFigures.component";

interface Props {

}

const StreetcodeContent = (props: Props) => (
    <div className='streetcodeContainer'>
        <MainBlock />
        <TextComponent/>
        <InterestingFactsComponent />
        <RelatedFiguresComponent />
        <SourcesComponent />
        <QRComponent />
    </div>
)

export default StreetcodeContent