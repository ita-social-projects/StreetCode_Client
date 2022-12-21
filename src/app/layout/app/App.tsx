import './App.styles.css';
import { ToastContainer } from "react-toastify";
import {useAsync} from "../../common/hooks/useAsync.hook";
import factsApi from "../../api/facts.api";

const App = () => {
    const { getAll } = factsApi;
    const { value: facts, error } = useAsync(getAll);

    console.log(error);

    return (
        <div className="App">
            <ToastContainer position='bottom-right' />
        </div>
    );
}

export default App;