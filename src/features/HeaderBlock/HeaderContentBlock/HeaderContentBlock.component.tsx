import './HeaderContentBlock.styles.scss';
import React from "react";

import { Skeleton } from "antd";
import { EyeOutlined } from "@ant-design/icons";

interface Props {
    title: string;
    numberOfEls?: number;
}

const HeaderContentBlock = ({ title, numberOfEls = 3 }: Props) => (
    <>
        <h2 className={"textHeader"}>{title}</h2>
        <div className={"recommendationContainer"}>
            {Array.apply(null, Array(numberOfEls)).map((_, idx) => (
                <Skeleton.Node key={idx} active={true}>
                    <EyeOutlined style={{fontSize: 40, color: '#bfbfbf'}}/>
                </Skeleton.Node>
            ))}
        </div>
    </>
);

export default HeaderContentBlock;