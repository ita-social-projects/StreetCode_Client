import "./Streetcode.styles.scss"
import SourcesComponent from "../Sources/Sources.component"
import InterestingFactsComponent from "../InterestingFacts/InterestingFacts.component"
import QRComponent from "../QRBlock/QR.component"
import MainBlock from "@features/MainBlock/MainBlock.component";
import TextComponent from "@/features/TextBlock/Text.component"

interface Props {

}

const StreetcodeContent = (props: Props) => (
    <div className='streetcodeContainer'>
        <MainBlock />
        <TextComponent/>
        <SourcesComponent />
        <InterestingFactsComponent />   
    </div>
    )

export default StreetcodeContent