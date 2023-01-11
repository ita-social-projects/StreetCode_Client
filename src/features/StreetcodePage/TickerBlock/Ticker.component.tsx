import './Ticker.styles.scss';

import Ticker from 'react-awesome-ticker';

const tickerItems = [
    'укладачі Інна Крупник, Оксана Юркова,',
    'редакторка Ім`я Прізвище,',
    'ілюстратор Сергій Федоров,', 'дизайнери Марія Кравцова, Олександр Івашко,',
    'актор дубляжу Ім`я Прізвище,',
];

const TickerComponent = () => (
    <Ticker className="tickerContainer">
        {tickerItems.map((item, idx) => (
            <div key={idx} className="tickerItem">{item}</div>
        ))}
    </Ticker>
);

export default TickerComponent;
