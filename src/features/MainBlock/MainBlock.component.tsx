import './MainBlock.styles.scss';
import Hrushevskyi from '@assets/images/Hrushevskyi.png'
import {Layout, Button, Breadcrumb} from "antd"
import { PlayCircleFilled } from '@ant-design/icons'
import SimpleSlider from "@features/SlickSlider/SlickSlider.component"


const MainBlock = () => {
    let slide = <img src={Hrushevskyi} className={"streetcodeImg"} />;

    const tags = ["Історія", '"Україна-Русь"', "Наукова школа","Наука", "Політика", "Професор історії"];

    const sep = <div className={"separator"}></div>;
    return (<div className='mainStreetcodeBlock margin-45px'>
        <div className='mainContainer'>
            <Breadcrumb separator={sep} className={"breadcrumbContainer"}>
                <Breadcrumb.Item href='' className={"breadcrumbItem font-weight-500"}>СТРІТКОДИ</Breadcrumb.Item>
                <Breadcrumb.Item href='' className={"breadcrumbItem"}>МИХАЙЛО ГРУШЕВСЬКИЙ</Breadcrumb.Item>
            </Breadcrumb>
            <Layout className='mainStreetcodeBlock'>
                <Layout.Content className={"mainContent"}>
                    <div className={"card"}>
                        <div className={"leftSider"}>
                            <div className={"leftSiderContentContainer"}>
                                <div className={"leftSiderContent"}>
                                    <SimpleSlider
                                        arrows={false}
                                        slidesToShow={1}
                                        slides={[slide, slide, slide, slide]}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"rightSider"}>
                            <div className={"headerContainer"}>
                                <div>
                                    <div className={"streetcodeIndex"}>
                                        Стріткод #0001
                                    </div>
                                    <h2 className={"streetcodeTitle"}>
                                        Михайло Грушевський
                                    </h2>
                                    <div className={"streetcodeDate"}>
                                        29 вересня 1866 року — 26 листопада 1934 року
                                    </div>
                                    <div className={"tagContainer"}>
                                        {tags.map(tag => (
                                            <Button className={"tagItem"} >
                                                {tag}
                                            </Button>
                                        ))}
                                    </div>
                                    <p className={"teaserBlock"}>
                                        У вересні 1907 за участі Грушевського, що увійшов до його керівництва, було
                                        створене<br/>
                                        нелегальне позапартійне українське громадське об'єднання — Товариство
                                        українських<br/>
                                        поступовців, що згуртувало сили українства й до 1917 року було єдиною
                                        діяльною українською< br/>
                                        організацією ліберального напряму.<br/>
                                        <br/>
                                        Свою політичну платформу Грушевський базував у той час
                                        на принципах конституційного парламентаризму й автономії
                                    </p>
                                    <div className={"bottomBtns"}>
                                        <Button type="primary" className={"hearTextBtn"}>
                                            <PlayCircleFilled className={"playCircle"}/>
                                            <span>Прослухати текст</span>
                                        </Button>
                                        <Button className={"animateFigureBtn"}>Оживити постать</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout.Content>
            </Layout>
        </div>
        </div>
    );
}

export default MainBlock;