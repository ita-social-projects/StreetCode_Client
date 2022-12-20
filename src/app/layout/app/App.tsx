import React from 'react';
import './App.styles.css';
import { Layout } from 'antd';
import {ToastContainer} from "react-toastify";
import {FactsApi} from "../../api/factsApi";

const App = () => {
    console.log(FactsApi.getAll());

    return (
        <div className="App">
            <ToastContainer position='bottom-right' />
        </div>
    );
}

export default App