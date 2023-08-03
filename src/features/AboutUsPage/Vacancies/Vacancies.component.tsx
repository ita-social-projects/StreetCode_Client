import './Vacancies.styles.scss'
import Vacancy from './Vacancy/Vacancy.model';

const Vacancies = () => (
    <div className='aboutUsBlockContainer'>
        <h1><div /><text>Вакансії</text><div /></h1>
        <div className='vacanciesBlock'>
            <div className='textBlock'>
                <h2>Приєднуйся до команди найактивніших стріткодерів, небайдужих до власної історії</h2>
                <h3>Твоє его фахівця поєдналося з его громадського активіста і не дає спати? Ти розділяєш наше прагнення заповнити прогалини історичної пам'яті українців через пізнавальний контент у міських просторах? Тоді тобі до нас! Приєднуйся — попрацюємо на зміни разом.</h3>
            </div>
            <Vacancy /> 
            <Vacancy />
            <Vacancy />
        </div>
    </div>
);

export default Vacancies;