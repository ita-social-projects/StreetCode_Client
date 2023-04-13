import './SupportUs.styles.scss';
import '../ContactUsPage/Title/Title.styles.scss';
import Footer from '@/app/layout/footer/Footer.component';
import Printer from '@/assets/images/donates/donatesPage/printer.svg';
import CreditCard from '@/assets/images/donates/donatesPage/credit-card.svg';
import Lamp from '@/assets/images/donates/donatesPage/lamp.svg';
import Camera from '@/assets/images/donates/donatesPage/camera.svg';
import Route from '@/assets/images/donates/donatesPage/route.svg';

const SupportUs = () => {
    return (
        <div className='supportUsPage'>
            <div className='supportUsPageWrapper'>
                <div className='heading'>
                    <div className="titleBig"> Підтримати нас</div>
                    <div className="titleSmall">
                        Привіт! Після всіх важливих сторінок нашої платформи ти нарешті тут — на не менш важливій сторінці твоєї залученості та підтримки.
                    </div>
                    <div className='text'>
                        Наша команда горить-палає місією «застріткодити всю Україну», розповісти про видатних Героїв та подати цікавенні факти з історії. 
                        Так, це ми. Але окрім внутрішніх волонтерських вогників наших сердець проєкту для стійкості та розвитку...
                    </div>
                </div>
                <div className='mainBlock'>
                    <div className='donatesPurposeBlock'>
                        <p className='heading'>
                            Потрібне фінансування, а саме — донати, внески, щедрості:
                        </p>
                        <ul className='purposeList'>
                            <li>
                                <Printer />
                                <span>для друку наших промовистих стріткодів-табличок</span>
                            </li>
                            <li>
                                <CreditCard />
                                <span>для оплати хостингу платформи та покриття операційних витрат</span>
                            </li>
                            <li>
                                <Lamp />
                                <span>для створення ілюстрацій «як-живий» </span>
                            </li>
                            <li>
                                <Camera />
                                <span>для зйомок «оце-так-відосиків»</span>
                            </li>
                            <li>
                                <Route />
                                <span>для складання «ой-мамо-маршрутів»</span>
                            </li>
                        </ul>
                        <div className='purposeBottomText'>
                            <p>
                                Всього того, чим ти обов'язково скористаєшся. А ще будеш пишатися участю, якщо долучишся 
                                та підтримаєш унікальну платформу «Стріткод». Де є про все: світло історії, велич Героїв 
                                та силу українців. Хіба можна таким не пишатися?
                            </p>
                            <p>
                                Тож обирай зручний спосіб допомогти так, щоб проєкт пульсував та жив, а історія промовляла 
                                в міських просторах. З історії ми знаємо, що світ не без добрих людей, а Стріткод — не без 
                                добрих стріткодерів.
                            </p>
                        </div>
                    </div>
                    <div className='donateWindow'>

                    </div>
                </div>
                <div className='donateSubBlocks'>
                    <div>

                    </div>
                </div>
                <p className='bottomText'>
                    Тиснемо твою руку на кнопці донатів, друже! Прям вся команда!
                </p>
            </div>
            <Footer />
        </div>
    )
}

export default SupportUs;