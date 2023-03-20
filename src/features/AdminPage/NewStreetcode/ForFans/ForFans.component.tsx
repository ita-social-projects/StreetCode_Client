import './ForFans.styles.scss';

import React from 'react';
import { DeleteOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';

import { Card, Col, Row } from 'antd';

const ForFansBlock = () => (
    <div className="ForFansContainer">
        <h3>Для фанатів</h3>
        <h4>Стріткоди</h4>
        <Row gutter={15}>
            <Col span={5}>
                <Card bordered={false}>
                 Книги
                    <FormOutlined />
                    <DeleteOutlined />
                </Card>
            </Col>
            <Col span={5}>
                <Card bordered={false}>
                 Фільми
                    <FormOutlined />
                    <DeleteOutlined />
                </Card>
            </Col>
            <Col span={5}>
                <Card bordered={false}>
                 Цитати
                    <FormOutlined />
                    <DeleteOutlined />
                </Card>
            </Col>
            <Col span={5}>
                <Card bordered={false}>
                    <PlusOutlined />
                </Card>
            </Col>
        </Row>
    </div>
);

export default ForFansBlock;
