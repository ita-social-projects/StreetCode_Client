import './PageBar.styles.scss';

const PageBar = () => {
    return(
        <div className='PageBarContainer'>
            <div className='BarContainer'>
                <span>Стрідкоди</span>
                <span>Словник</span>
                <span>Користувач</span>
            </div>
        </div>
    );
}

export default PageBar;