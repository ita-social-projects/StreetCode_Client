import "./Ticker.styles.scss";
import Ticker from 'react-awesome-ticker';
import {useParams} from "react-router-dom";
import {useAsync} from "@hooks/stateful/useAsync.hook";
import subtitlesApi from "@api/additional-content/subtitles.api";
import Subtitle, {SubtitleStatus} from "@models/additional-content/subtitles.model";

const TickerComponent = () => {
    const streetcodeId = useParams<{id: string}>();
    const id = parseInt(streetcodeId.id ?? "1");
    const {value} = useAsync(() =>subtitlesApi.getSubtitlesByStreetcodeId(id));
    let subtitles = value as Subtitle[];

    const createSubtitleString = (subtitles?: Subtitle[]): Map<number, string> => (
        new Map(subtitles?.map(({ id, firstName, lastName, subtitleStatus }) => [id, `${Object.keys(SubtitleStatus)[subtitleStatus]} ${firstName} ${lastName}, `] )) );
    const subtitleMap = createSubtitleString(subtitles);

    return (
        <Ticker className={"tickerContainer"}>
            <div className={"tickerItem"}>{Array.from(subtitleMap.values()).join('')}</div>
        </Ticker>
    );

}

export default TickerComponent;