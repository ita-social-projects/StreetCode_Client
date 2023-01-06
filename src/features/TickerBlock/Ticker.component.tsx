import Ticker from 'react-awesome-ticker';
import "./Ticker.styles.scss"

let tickerItems:string[] = ["укладачі Інна Крупник, Оксана Юркова,","редакторка Ім`я Прізвище,","ілюстратор Сергій Федоров,","дизайнери Марія Кравцова, Олександр Івашко,","актор дубляжу Ім`я Прізвище,"];
const TickerComponent = () => (
    <Ticker className={"tickerContainer"}>
        {tickerItems.map(item=>(
            <div className={"tickerItem"}>{item}</div>
        ))}
    </Ticker>
)
export default TickerComponent;