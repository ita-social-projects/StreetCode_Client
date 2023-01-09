import "./Ticker.styles.scss";
import Ticker from 'react-awesome-ticker';
import Subtitle from "@models/additional-content/subtitles.model";
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useParams } from 'react-router-dom';
import SubtitlesApi from "@api/additional-content/subtitles.api";
import {SubtitleStatus} from "@models/additional-content/subtitles.model";

function createSubtitleString(subtitles:Subtitle[]){
    let tickerItems:string[] = [];
    subtitles.forEach((item)=>{
        let tickerItem:string;
        let subtitleStatus = Object.values(SubtitleStatus)[item.subtitleStatus];
        tickerItem = subtitleStatus + " " + item.firstName + " " + item.lastName + ", ";
        tickerItems.push(tickerItem);
    })
    return tickerItems;
}

const TickerComponent = () => {
    const streetcodeId = useParams<{id: string}>();
    const id = parseInt(streetcodeId.id ?? "1");
    const {value} = useAsync(() =>SubtitlesApi.getAll());
    let subtitles = value as Subtitle[];
    subtitles = (subtitles || []).filter((element) => {
        return element.streetcodeId===id;
    });
    return (
        <Ticker className={"tickerContainer"}>
            {createSubtitleString(subtitles).map((item, idx) => (
                <div key={idx} className={"tickerItem"}>{item}</div>
            ))}
        </Ticker>
    );

}

export default TickerComponent;