import "./Ticker.styles.scss";
import Ticker from 'react-awesome-ticker';
import {useParams} from "react-router-dom";
import {useAsync} from "@hooks/stateful/useAsync.hook";
import subtitlesApi from "@api/additional-content/subtitles.api";
import Subtitle, {SubtitleStatus} from "@models/additional-content/subtitles.model";

const tickerItems = [
    "укладачі Інна Крупник, Оксана Юркова,",
    "редакторка Ім`я Прізвище,",
    "ілюстратор Сергій Федоров,","дизайнери Марія Кравцова, Олександр Івашко,",
    "актор дубляжу Ім`я Прізвище,"
];

const TickerComponent = () => {
    const streetcodeId = useParams<{id: string}>();
    const id = parseInt(streetcodeId.id ?? "1");
    const {value} = useAsync(() =>subtitlesApi.getSubtitlesByStreetcodeId(id));
    let subtitles = value as Subtitle[];
    console.log(subtitles);

    const createSubtitleString = (subtitles?: Subtitle[]): Map<number, string> => (
        new Map(subtitles?.map(({ id, firstName, lastName, subtitleStatus }) => [id, `${Object.keys(SubtitleStatus)[subtitleStatus]} ${firstName} ${lastName}, `] )) );
    const subtitleMap = createSubtitleString(subtitles);
    console.log(subtitleMap);
    const subtitless = Array.from(subtitleMap.values()).join('')

    /*
    subtitles = (subtitles || []).filter((element) => {
        return element.streetcodeId===id;
    });
     */
    return (
        <Ticker className={"tickerContainer"}>
            <div className={"tickerItem"}>{subtitless}</div>
        </Ticker>
    );

}

export default TickerComponent;