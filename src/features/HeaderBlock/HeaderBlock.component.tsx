import './HeaderBlock.styles.scss';
import StreetcodeSvg from "@assets/images/header/Streetcode_title.svg";
import MagnifyingGlass from "@assets/images/header/Magnifying_glass.svg";

import useToggle from "@common/hooks/stateful/useToggle.hook";
import {Button, Drawer, Dropdown, Input} from "antd";

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
    const { toggleState, handlers: { toggle } } = useToggle();

    return (
        <div className={"navBarContainer"}>
            <div className={"leftPartContainer"}>
                <StreetcodeSvg />
                <Input size="large" placeholder="Пошук..." prefix={<MagnifyingGlass />} />
                <Dropdown menu={{ items }} placement="bottom" arrow={{ pointAtCenter: true }}>
                    <Button className={"langSelector"}>
                        <span>UA</span>
                    </Button>
                </Dropdown>
            </div>
            <div className={"rightPartContainer"}>
                <div className={"rightSectionContainer"}>
                    <Drawer placement="right" closable onClose={toggle} open={toggleState}>
                        <>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </>
                    </Drawer>
                    <div className={"burgerMenuContainer"} onClick={toggle}>
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