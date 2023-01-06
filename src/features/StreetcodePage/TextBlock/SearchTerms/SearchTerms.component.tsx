import { Popover } from 'antd';

interface Props {
    mainText: string;
}

const KeywordsToSearch = ["києва", "заслання", "україна", "січових стрільців"];

const SearchTerms = (props: Props) => {
    let listOfObjects: any = { };

    KeywordsToSearch.forEach(kw => {
        listOfObjects[kw] = { color: "#8D1F16" };
    });

    const getStyle = (text: string) => {
      const styleKey = text.toLowerCase();
      return listOfObjects[styleKey] || {};
    };

    const getTerm = (text: string) => {
      const styleKey = text.toLowerCase();
      return listOfObjects[styleKey] || false;
    };

    const parts = props.mainText.split(
      new RegExp(`(${KeywordsToSearch.join("|")})`, "gi")
    );

    return (
        <div>
            {parts.map((part, idx) => (
                <span key={idx} style={getStyle(part)}>
                {getTerm(part) === false ? (
                    <span>{part}</span>
                    ) : (
                    <Popover content={'Description'} title={part}>
                        <span style={{ cursor: 'pointer' }}>
                            {part}
                        </span>
                    </Popover>
                )}
                </span>
            ))}
        </div>
    );
}
 export default SearchTerms;