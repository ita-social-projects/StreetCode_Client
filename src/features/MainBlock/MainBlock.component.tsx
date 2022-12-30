import './MainBlock.styles.scss';
import Hrushevskyi from '@assets/images/Hrushevskyi.png'

import { Layout, Button } from "antd"
import Sider from 'antd/es/layout/Sider'

import { PlayCircleFilled } from '@ant-design/icons'
import SimpleSlider from "@features/SlickSlider/SlickSlider.component"


const MainBlock = () => {
    let teaser = {display: "flex", alignItems: "flex-start", padding: "10px", gap: "26px", fontSize: '20px', color: "#1D1F23", fontWeight: "lighter"};

    let slide = <img src={Hrushevskyi} style={{padding: "25px"}}/>;

    return (<>
            <Layout>
                <Sider style={{backgroundColor:"white"}}>Sider</Sider>
                <Layout>
                    <Layout.Header className={"header"}>Header</Layout.Header>
                    <Layout.Content className={"mainContent"}>
                        <div className={"card"}>
                            <div>
                                <div style={{float: 'left', border: '4px', width: "45%", height: "697px", backgroundColor:'#fff',
                                    borderRadius: "50px",  display:"flex", justifyContent: "center", alignItems:"center"}}>
                                    <div style={{padding: "20px", height: "100%", width: "100%"}}>
                                        <div style={{backgroundColor: "#F4F4F4", borderRadius: "30px", height: "100%", width: "100%", display:"flex", justifyContent: "center", alignItems:"center"}}>
                                            <SimpleSlider arrows={false} slidesToShow={1} slides={[slide,slide,slide,slide]} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{float: 'right', height: "697px", width: "55%", display:"flex", justifyContent: "center", alignItems:"center"}}>
                                    <div className={"headerContainer"}>
                                        <div style={{display:"inline"}}>
                                            <div style={{padding: "10px", fontSize: '20px', color: "#8D1F16", fontWeight:"bolder"}}>
                                                Стріткод #0313
                                            </div>
                                            <h2 style={{padding: "10px", fontSize: '36px'}}>
                                                Михайло Грушевський
                                            </h2>
                                            <div style={{padding: "10px", fontSize: '20px'}}>
                                                29 вересня 1866 року — 26 листопада 1934 року
                                            </div>

                                            <ul style={{listStyle: "none", display: "inline"}}>
                                                <li style={{display: "inline"}}>
                                                    <Button danger size='large' style={{marginLeft: "10px", fontSize: '20px', color: "#DB3424", fontWeight: "bold", borderWidth:"2px", borderColor:"#DB3424", borderRadius: "10px", display:"inline-flex", justifyContent: "center", alignItems:"center"}}>Історія</Button>
                                                </li>
                                                <li style={{display: "inline"}}>

                                                    <Button danger size='large' style={{marginLeft: "10px", fontSize: '20px', color: "#DB3424", fontWeight: "bold", borderWidth:"2px", borderColor:"#DB3424", borderRadius: "10px", display:"inline-flex", justifyContent: "center", alignItems:"center"}}>"Україна-Русь"</Button>

                                                </li>
                                                <li style={{display: "inline"}}>

                                                    <Button danger size='large' style={{marginLeft: "10px", fontSize: '20px', color: "#DB3424", fontWeight: "bold", borderWidth:"2px", borderColor:"#DB3424", borderRadius: "10px", display:"inline-flex", justifyContent: "center", alignItems:"center"}}>Наукова школа</Button>

                                                </li>
                                                <li style={{display: "inline"}}>

                                                    <Button danger size='large' style={{marginLeft: "10px", fontSize: '20px', color: "#DB3424", fontWeight: "bold", borderWidth:"2px", borderColor:"#DB3424", borderRadius: "10px", display:"inline-flex", justifyContent: "center", alignItems:"center"}}>Наука</Button>

                                                </li>
                                            </ul>

                                            <p className={"teaserBlock"}>
                                                У вересні 1907 за участі Грушевського, що увійшов до його керівництва, було створене
                                                нелегальне позапартійне українське громадське об'єднання — Товариство українських
                                                поступовців, що згуртувало сили українства й до 1917 року було єдиною діяльною українською
                                                організацією ліберального напряму.

                                                Свою політичну платформу Грушевський базував у той час
                                                на принципах конституційного парламентаризму й автономії
                                            </p>
                                            <div style={{display:"flex", justifyContent: "center"}}>
                                                <Button type="primary" danger size='large' style={{width: "271px", fontSize: '20px', height: "73px", marginRight: "10px", display:"flex", justifyContent: "center", alignItems:"center", backgroundColor: "#DB3424", borderRadius: "20px"}}>

                                                    <PlayCircleFilled style={{fontSize: '37px', marginRight: "15px"}}/>
                                                    <span>
                                Послухати текст
                              </span>

                                                </Button>
                                                <Button danger size='large' style={{width: "218px", height: "73px", marginLeft: "10px", fontSize: '20px', color: "#DB3424", fontWeight: "bolder", borderWidth:"4px", borderColor:"#DB3424", borderRadius: "20px"}}>Оживити постать</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Layout.Content>
                    <Layout.Footer>Footer</Layout.Footer>
                </Layout>
            </Layout>
        </>
    )
}

export default MainBlock;