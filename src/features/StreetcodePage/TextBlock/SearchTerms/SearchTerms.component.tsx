import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import useMobx from '@/app/stores/root-store';
import { Term } from '@/models/streetcode/text-contents.model';
import { Popover } from 'antd';

interface Props {
    mainText: string;
}
interface style { color: string }
const SearchTerms=(props: Props)=> {

  var setColor :style={color:"#8D1F16"};
  const{termsStore: {fetchTerms, getTermArray}} = useMobx();
  useAsync(fetchTerms);

  var listOfObjects =new Map<string, style>();
  var TermSearch=new Map<string, string|undefined>();

  getTermArray().map((e: Term)=>{
    TermSearch.set(e.title, e.description); 
    listOfObjects.set(e.title, setColor);
  });
  
  const getStyle = (text: any) => {
    const styleKey = text.toLowerCase();
    return listOfObjects.get(styleKey) || {};
  };

  const getTerm = (text: any) => {
    const styleKey = text.toLowerCase();
    return listOfObjects.get(styleKey) ||  false;
  };
     
  var parts= props.mainText.split(
    new RegExp(`(${[...TermSearch.keys()].join("|")})`, "gi")
  );
      
  var tempKeyword = [];
  tempKeyword = parts.map((part, i) => (
    <span key={i} style={getStyle(part)}>
      {getTerm(part)==false?
          <span>{part}</span>
          :        
          <Popover overlayStyle={{width: '300px'}} content={TermSearch.get(part.toLocaleLowerCase())}>
            <span style={{cursor:"pointer"}}>
                { part }
            </span>
          </Popover>   
      }
    </span>
  ));
  
  return <div>{tempKeyword}</div>;  
}
export default SearchTerms;