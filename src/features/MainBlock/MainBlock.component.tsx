import './MainBlock.styles.scss';
import Hrushevskyi from '@assets/images/Hrushevskyi.png'

import {Layout, Button, Breadcrumb} from "antd"
import Sider from 'antd/es/layout/Sider'

import { PlayCircleFilled } from '@ant-design/icons'
import SimpleSlider from "@features/SlickSlider/SlickSlider.component"


const MainBlock = () => {
    let slide = <img src={Hrushevskyi} style={{padding: "25px"}} />;

    const tags = ["Наука", "Наукова школа", "Історія", "Історія", "Історія", "Історія"];

    return (
        <>
            <Breadcrumb separator=">">
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item href="">Application Center</Breadcrumb.Item>
                <Breadcrumb.Item href="">Application List</Breadcrumb.Item>
                <Breadcrumb.Item>An Application</Breadcrumb.Item>
            </Breadcrumb>
            <Layout>
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
                                            <Button danger size='large' className={"tagItem"}>
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
                                    <div className={"footer"}>
                                        <Button type="primary" danger size='large' style={{
                                            width: "271px",
                                            fontSize: '20px',
                                            height: "73px",
                                            display: "flex",
                                            fontWeight: "500",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#DB3424",
                                            borderRadius: "14px"
                                        }}>
                                            <PlayCircleFilled style={{fontSize: "37px", marginRight: "10px"}}/>
                                            <span>Прослухати текст</span>
                                        </Button>
                                        <Button danger size='large' style={{
                                            width: "218px",
                                            height: "73px",
                                            fontSize: '20px',
                                            color: "#DB3424",
                                            fontWeight: "500",
                                            borderWidth: "3px",
                                            borderColor: "#DB3424",
                                            borderRadius: "14px"
                                        }}>Оживити постать</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout.Content>
            </Layout>
        </>
    );
}

export default MainBlock;