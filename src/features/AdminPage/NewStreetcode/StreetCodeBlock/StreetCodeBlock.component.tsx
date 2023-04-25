import React from "react";
import { Form } from 'antd';
import MainBlockAdmin from "../MainBlock/MainBlockAdmin.component";

import { useForm } from 'antd/es/form/Form';
import TextForm from "../TextBlock/TextForm/TextForm.component";

const streetCodeBlock = () => {
    const [form] = useForm();

    return(
        <div className='adminContainer-block'>
            <h2>Стріткод</h2>
            
            <Form form={form} layout="vertical">
                <MainBlockAdmin form={form} />
                <TextForm />
            </Form>
        </div>
    )
}

export default streetCodeBlock;