import RelatedFigure from "models/streetcode/related-figure.model";
import Streetcode, {EventStreetcode, PersonStreetcode} from "models/streetcode/streetcode-types.model";
import {Term, Text, Fact} from "models/streetcode/text-contents.model";
import "./Streetcode.styles.css"

interface Props {

}


const StreetcodeContent = ({  }: Props) => {
    return (
        <div className={"streetcodeContainer"}>
        </div>
    );
}

export default StreetcodeContent;