import "./Streetcode.styles.scss"

import SourcesComponent from "@features/SourcesBlock/Sources.component"
import InterestingFactsComponent from "../InterestingFacts/InterestingFacts.component"
import QRComponent from "../QRBlock/QR.component"
import MainBlock from "@features/MainBlock/MainBlock.component";
import TextComponent from "@features/TextBlock/Text.component";
import RelatedFiguresComponent from "@/features/RelatedFiguresBlock/RelatedFigures.component";
import HeaderBlock from "@features/HeaderBlock/HeaderBlock.component";
import Footer from "@/app/layout/footer/Footer.component";

interface Props {

}

const StreetcodeContent = (props: Props) => (
    <div className='streetcodeContainer'>
        <HeaderBlock />
        <MainBlock />
        <TextComponent/>
        <InterestingFactsComponent />
        <RelatedFiguresComponent />
        <SourcesComponent />
        <QRComponent />
        <Footer />
    </div>
)

export default StreetcodeContent