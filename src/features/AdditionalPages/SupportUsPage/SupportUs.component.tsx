import './SupportUs.styles.scss';
import '../ContactUsPage/Title/Title.styles.scss';

const SupportUs = () => {
    return (
        <div className='supportUsPage'>
            <div className="titleBig"> Підтримати нас</div>
            <div className="titleSmall heading">
                Привіт! Після всіх важливих сторінок нашої платформи ти нарешті тут — на не менш важливій сторінці твоєї залученості та підтримки.
            </div>
            <div className='text heading'>
                Наша команда горить-палає місією «застріткодити всю Україну», розповісти про видатних Героїв та подати цікавенні факти з історії. 
                Так, це ми. Але окрім внутрішніх волонтерських вогників наших сердець проєкту для стійкості та розвитку...
            </div>
        </div>
    )
}

export default SupportUs;