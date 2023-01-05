import './Footer.styles.scss';

import FaceBook from '@assets/images/FaceBook.png';
import Instagram from '@assets/images/Instagram.png';
import StreetcodeFooter from '@assets/images/streetcode-footer.png';
import TikTok from '@assets/images/TikTok.png';
import Twitter from '@assets/images/Twitter.png';

interface Props {

}

function Footer({ }: Props) {
    return (

      <div className="footer-component">
        <footer>
          <div className="footer-container">
            <div className="block-footer-icon">
              <img className="footer-icon" src={StreetcodeFooter} />
            </div>
            <div className="useful-links">
              <ul className="use-links">
                <li className="li-item">Головна</li>
                <li className="li-item">Стріткоди</li>
                <li className="li-item">Маршрути</li>
                <li className="li-item">Блог</li>
                <li className="li-item">Про проект</li>
                <li className="li-item">Контакти</li>
              </ul>
              <ul className="use-links">
                <li className="li-item">Партнери</li>
                <li className="li-item">Вакансії</li>
                <li className="li-item">Донати</li>
              </ul>
              <ul className="use-links support-links">
                <li className="li-item">Політика конфіденційності</li>
                <li className="li-item">Зворотній з'язок</li>
                <li className="li-item">Cookies</li>
              </ul>
              <ul className="social-icons">
                <li className="brands"><a href=""><img src={FaceBook} /></a></li>
                <li className="brands">
                  <a href="">
                    <img src={Instagram} />
                    {' '}
                  </a>
                </li>
                <li className="brands"><a href=""><img src={TikTok} /></a></li>
                <li className="brands"><a href=""><img src={Twitter} /></a></li>
              </ul>
            </div>
          </div>
        </footer>
        <section>
          <div className="copy-right-sec">
            <p>© 2022 ГО “Історична Платформа” . При використанні матеріалів сайту посилання на джерело обов’язкове.</p>
          </div>
        </section>
      </div>
    );
}

export default Footer;
