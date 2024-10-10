import './Title.styles.scss';

import { Link } from 'react-router-dom';

const Title = () => (
    <div className="titleContainer">
        <div className="title">
            <div className="titleSmall">Політика конфіденційності</div>
            <div className="titleBig">Політика конфіденційності</div>
            <div className="subTitle">
                та захисту персональних даних платформи&nbsp;
                <Link className="link" to="/">www.streetcode.com.ua</Link>
            </div>
        </div>
        <div className="disclaimer">
            Раді бачити! Невеличкий дисклеймер: якщо ти відвідуєш дану платформу, то
            автоматично погоджуєшся з даною політикою конфіденційності та її умовами.
        </div>
    </div>
);

export default Title;
