import './HeaderContentBlock.styles.scss';

import React from 'react';
import { EyeOutlined } from '@ant-design/icons';

import { Skeleton } from 'antd';

interface Props {
    title: string;
    numberOfEls?: number;
}

const HeaderContentBlock = ({ title, numberOfEls = 3 }: Props) => (
    <>
        <h2 className="textHeader">{title}</h2>
        <div className="recommendationContainer">
            {Array(numberOfEls).fill(0).map((_, idx) => (
                <Skeleton.Node key={idx} active>
                    <EyeOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                </Skeleton.Node>
            ))}
        </div>
    </>
);

export default HeaderContentBlock;
