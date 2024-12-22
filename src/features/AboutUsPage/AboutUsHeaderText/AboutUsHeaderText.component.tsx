import "./AboutUsHeaderText.styles.scss";

const AboutUsHeaderText = () => (
    <div className="aboutUsBlockContainer">
        <div className="headerTitle">ПРО НАС</div>

        <div className="contentWrapper">
            <div className="headerBigText">
                Привіт! Ми — ГО{" "}
                <label className="redText">«Історична Платформа»</label>, що
                разом із командою досвідчених креаторів, провідних істориків та
                потужних партнерів створює «Historycode» — найбільшу платформу
                про історію України, вбудовану в простори міст.
            </div>

            <div className="headerList">
                <div className="listItem">
                    <div className="redLine" />
                    <div className="listText">
                        Ми розповідаємо про видатні постаті та визначні події,
                        на честь яких названі наші вулиці.
                    </div>
                </div>
                <div className="listItem">
                    <div className="redLine" />
                    <div className="listText">
                        Пояснюємо історичні зв’язки у просторі та часі.
                    </div>
                </div>
                <div className="listItem">
                    <div className="redLine" />
                    <div className="listText">
                        Посилюємо історичну просвіту, популяризуємо історію,
                        допомагаємо з декомунізацією історичної свідомості.
                    </div>
                </div>
            </div>

            <div className="headerSmallText">
                Все це верифіковано, концентровано, структуровано та в одному
                місці. Щоб нарешті позбутися колонізаторських впливів та
                наслідків.
            </div>
        </div>
    </div>
);

export default AboutUsHeaderText;
