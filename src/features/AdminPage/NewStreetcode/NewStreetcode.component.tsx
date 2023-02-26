import PageBar from '../PageBar/PageBar.component';
import './NewStreetcode.styles.scss';
import { Card, Col, Row } from 'antd';
import {DeleteOutlined, FormOutlined, PlusOutlined} from '@ant-design/icons';
import React from 'react';

const cardStyle: React.CSSProperties = {
    textAlign: 'center',
  };

 const NewStreetcode = () => (
     <div className="NewStreetcodeContainer">
       <PageBar/>  
       <div className='ForFansContainer'>
          <h3>Для фанатів</h3>
          <h4>Стріткоди</h4>
    <Row gutter={15}>
           <Col span={5}>
              <Card bordered={false} style={cardStyle}>
                 Книги      
                 <FormOutlined />
                 <DeleteOutlined />
              </Card>
           </Col>
           <Col span={5}>
              <Card bordered={false} style={cardStyle}>
                 Фільми       
                 <FormOutlined />
                 <DeleteOutlined />
              </Card>
           </Col>
           <Col span={5}>
              <Card bordered={false} style={cardStyle}>
                 Цитати        
                 <FormOutlined />
                 <DeleteOutlined />
              </Card>
           </Col>
           <Col span={5}>
              <Card bordered={false} style={cardStyle}>
              <PlusOutlined />
              </Card>
           </Col>
    </Row>
       </div>
     </div>
 );

 export default NewStreetcode;