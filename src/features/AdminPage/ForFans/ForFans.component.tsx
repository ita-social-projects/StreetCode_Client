import PageBar from '../PageBar/PageBar.component';
import './ForFans.styles.scss';
import { Cascader } from 'antd';

interface Option {
    value: string;
    label: string;
  }

const options: Option[] = []
    
  
  const onChange = (value: string[]) => {
    console.log(value);
  };

 const ForFans = () => (
     <div className="ForFansContainer">
       <PageBar/>  
       <h3>Категорія</h3>
     </div>
 );

 export default ForFans;
  
