import "./Streetcode.styles.scss"

import SourcesComponent from "../Sources/Sources.component"
import InterestingFactsComponent from "../InterestingFacts/InterestingFacts.component"
import QRComponent from "../QRBlock/QR.component"


interface Props {

}

const StreetcodeContent = (props: Props) => (
    <div className='streetcodeContainer'>
        <SourcesComponent />
        <InterestingFactsComponent />
    </div>
    )

export default StreetcodeContent