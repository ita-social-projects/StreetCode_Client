import './HeaderBlock.styles.scss';
import StreetcodeSvg from "@assets/images/header/Streetcode_title.svg";
import MagnifyingGlass from "@assets/images/header/Magnifying_glass.svg";

import useToggle from "@common/hooks/stateful/useToggle.hook";

import {
    Button,
    Drawer,
    Dropdown,
    Input,
    Popover,
    Skeleton,
} from "antd";
import { EyeOutlined } from '@ant-design/icons';

const items = [
    {
        key: '1',
        disabled: true,
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                UA (Ukrainian)
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                RU (Russian)
            </a>
        ),
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                EN (English GB)
            </a>
        ),
    },
];

interface Props {

}

const HeaderBlock = (props: Props) => {
    const { toggleState: langSelectorState, handlers: { toggle: toggleLangSelector } } = useToggle();
    const tags = ["Історія", '"Україна-Русь"', "Наукова школа","Наука", "Політика", "Професор історії"];

    return (
        <div className={"navBarContainer"}>
            <div className={"leftPartContainer"}>
                <StreetcodeSvg />
                <Popover placement="bottomLeft" trigger='focus' content={(
                    <div className={"headerPopupSkeleton"}>
                        <div className={"leftSide"}>
                            <h2 className={"textHeader"}>Рекомендації</h2>
                            <div className={"recommendationContainer"}>
                                <Skeleton.Node active={true}>
                                    <EyeOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                                </Skeleton.Node>
                                <Skeleton.Node active={true}>
                                    <EyeOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                                </Skeleton.Node>
                                <Skeleton.Node active={true}>
                                    <EyeOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                                </Skeleton.Node>
                            </div>
                            <h2 className={"textHeader"}>Пошук по тегам</h2>
                            <div className={"tagContainer"}>
                                {tags.map(tag => (
                                    <Button className={"tagItem"}>
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className={"rightSide"}>
                            <h2 className={"textHeader"}>Новини</h2>
                            <div className={"recommendationContainer"}>
                                <Skeleton.Node active={true}>
                                    <EyeOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                                </Skeleton.Node>
                                <Skeleton.Node active={true}>
                                    <EyeOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                                </Skeleton.Node>
                                <Skeleton.Node active={true}>
                                    <EyeOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                                </Skeleton.Node>
                                <Skeleton.Node active={true}>
                                    <EyeOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                                </Skeleton.Node>

                            </div>
                        </div>
                    </div>
                )}>
                    <Input size="large" placeholder="Пошук..." prefix={<MagnifyingGlass />} />
                </Popover>
                <Dropdown menu={{ items }} placement="bottom" arrow={{ pointAtCenter: true }}>
                    <Button className={"langSelector"}>
                        <span>UA</span>
                    </Button>
                </Dropdown>
            </div>
            <div className={"rightPartContainer"}>
                <div className={"rightSectionContainer"}>
                    <Drawer placement="right" closable onClose={toggleLangSelector} open={langSelectorState}>
                        <>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </>
                    </Drawer>
                    <div className={"burgerMenuContainer"} onClick={toggleLangSelector}>
                        <span className={"burgerMenuItem"} />
                        <span className={"burgerMenuItem"} />
                        <span className={"burgerMenuItem"} />
                    </div>
                    <Button className={"loginBtn"} type='primary'>Долучитися</Button>
                </div>
            </div>
        </div>
    );
}

export default HeaderBlock;