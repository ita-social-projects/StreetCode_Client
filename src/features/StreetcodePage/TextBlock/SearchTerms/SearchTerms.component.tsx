import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import useMobx from '@/app/stores/root-store';
import { Term } from '@/models/streetcode/text-contents.model';
import { Popover } from 'antd';

interface Props {
    mainText: string;
}

const SearchTerms=(props: Props)=> {
      const{termsStore: {fetchTerms, getTermArray}} = useMobx();
      useAsync(()=>fetchTerms());

      var listOfObjects :any= {};
      var TermSearch=new Map<string, string|undefined>();
      getTermArray().map((e: Term)=>{
        TermSearch.set(e.title, e.description); 
        listOfObjects[e.title] = { color: "#8D1F16" };
      });

      const KeywordsToSearch = [...TermSearch.keys()];
  
      const getStyle = (text: any) => {
        const styleKey = text.toLowerCase();
        return listOfObjects[styleKey] || {};
      };
      const getTerm = (text: any) => {
        const styleKey = text.toLowerCase();
        return listOfObjects[styleKey] ||  false;
      };
     
      var parts= props.mainText.split(
        new RegExp(`(${KeywordsToSearch.join("|")})`, "gi")
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