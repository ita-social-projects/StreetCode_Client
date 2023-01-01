import { message, Popover } from 'antd';
import { cursorTo } from 'readline';

type Props ={allText: string}
const SearchTerms=(props: Props)=> {
    var listOfObjects :any= {};
    var KeywordsTosearch = ["києва", "заслання","україна","січових стрільців"];

    KeywordsTosearch.forEach(function(entry) {
        listOfObjects[entry]= {
          color: "#8D1F16"
        };
    });

    const getStyle = (text: any) => {
      const styleKey = text.toLowerCase();
      return listOfObjects[styleKey] || {};
    };

    const getTerm = (text: any) => {
      const styleKey = text.toLowerCase();
      return listOfObjects[styleKey] ||  false;
    };

    var parts = props.allText.split(
      new RegExp(`(${KeywordsTosearch.join("|")})`, "gi")
    );

    var tempKeyword = [];
    tempKeyword = parts.map((part, i) => (
      <span key={i} style={getStyle(part)}>
        {getTerm(part)==false?
            <span>{part}</span>
                :
            <Popover content={"Description"} title={part}>
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