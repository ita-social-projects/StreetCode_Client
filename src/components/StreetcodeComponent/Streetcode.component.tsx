import RelatedFigure from "models/streetcode/related-figure.model";
import Streetcode, {EventStreetcode, PersonStreetcode} from "models/streetcode/streetcode-types.model";
import {Term, Text, Fact} from "models/streetcode/text-contents.model";
import "./Streetcode.styles.css"
import SourcesComponent from "../Sources/Sources.component";


interface Props {

}


const StreetcodeContent = ({  }: Props) => {
    return (
        <div className={"streetcodeContainer"}>
        <SourcesComponent/>
        </div>
    );
}

export default StreetcodeContent;