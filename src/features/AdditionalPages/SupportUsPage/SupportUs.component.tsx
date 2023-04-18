import './SupportUs.styles.scss';
import '../ContactUsPage/Title/Title.styles.scss';
import Footer from '@/app/layout/footer/Footer.component';
import Printer from '@/assets/images/donates/donatesPage/printer.svg';
import CreditCard from '@/assets/images/donates/donatesPage/credit-card.svg';
import Lamp from '@/assets/images/donates/donatesPage/lamp.svg';
import Camera from '@/assets/images/donates/donatesPage/camera.svg';
import Route from '@/assets/images/donates/donatesPage/route.svg';
import QRCode from '@/assets/images/donates/donatesPage/qr-code.svg';
import useMobx from '@/app/stores/root-store';

const SupportUs = () => {
    const { modalStore: { setModal } } = useMobx();

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
                                <span>для оплати хостингу платформи та покриття oперативних витрат</span>
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
                    <div className='block'>
                        <p className='heading'>На карту</p>
                        <div className='content'>
                            <QRCode />
                        </div>
                        <button className='supportButton'>Задонатити</button>
                    </div>
                    <div className='block forCompanies'>
                        <p className='heading'>Для компаній</p>
                        <div className='content'>
                            <p>Сконтактуй з нашою командою щодо Стріткод-партнерства та внесків на 
                                історію в просторі міст від юридичних осіб. Раді будемо запартнеритися 
                                із соціально-відповідальним бізнесом.</p>
                        </div>
                        <button className='supportButton' onClick={() => setModal('partners')}>Стати партнером</button>
                    </div>
                    <div className='block bankAccount'>
                        <p className='heading'>За реквізитами</p>
                        <div className='content'>
                            <p>ГО «Історична платформа»</p>
                            <p>ЄДРПОУ 44801186</p>
                            <p>Призначення:</p>
                            <p>«Добровільний внесок на статутну діяльність»</p>
                            <div className='accountInfo'>
                                <p>Рахунок UAH</p>
                                <p className='thickerText'>UA753057490000026003000018553</p>
                            </div>
                        </div>
                        <button className='supportButton'>Скопіювати рахунок UAH</button>
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