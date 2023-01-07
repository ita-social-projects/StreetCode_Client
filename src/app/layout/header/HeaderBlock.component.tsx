import './HeaderBlock.styles.scss';
import StreetcodeSvg from "@images/header/Streetcode_title.svg";
import MagnifyingGlass from "@images/header/Magnifying_glass.svg";

import useToggle from "@hooks/stateful/useToggle.hook";
import { Button, Drawer, Dropdown, Input, Popover } from "antd";

import TagList from "@components/TagList/TagList.component";
import HeaderContentBlock from "@layout/header/HeaderContentBlock/HeaderContentBlock.component";
import BurgerMenu from "@components/BurgerMenu/BurgerMenu.component";
import { Outlet } from 'react-router-dom';

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

    return (
        <>
            <div className={"navBarContainer"}>
                <div className={"leftPartContainer"}>
                    <StreetcodeSvg />
                    <Popover placement="bottomLeft" trigger='focus' content={(
                        <div className={"headerPopupSkeleton"}>
                            <div className={"leftSide"}>
                                <HeaderContentBlock title={"Рекомендації"} />
                                <h2 className={"textHeader"}>Пошук по тегам</h2>
                                <TagList />
                            </div>
                            <div className={"rightSide"}>
                                <HeaderContentBlock title={"Новини"} numberOfEls={4} />
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
                        <BurgerMenu onClick={toggleLangSelector} />
                        <Button className={"loginBtn"} type='primary'>Долучитися</Button>
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
}

export default HeaderBlock;