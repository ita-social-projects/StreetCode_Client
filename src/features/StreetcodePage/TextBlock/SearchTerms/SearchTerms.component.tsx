import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import useMobx from "@/app/stores/root-store";
import { Popover } from "antd";

interface Props {
  mainText: string;
}

const keywordColoring = {
  color: "#8D1F16",
};

const SearchTerms = (props: Props) => {
  const {
    termsStore: { fetchTerms, getTermArray },
  } = useMobx();
  useAsync(fetchTerms);

  const searchTerms: string[] = [];
  var descriptiveSearchTerms = new Map<string, string | undefined>();

  getTermArray().forEach((term) => {
    descriptiveSearchTerms.set(term.title, term.description);
    searchTerms.push(term.title);
  });

  var splittedKeywordText = props.mainText.split(
    new RegExp(
      `(${searchTerms.map((st) => st.toLocaleLowerCase()).join("|")})`,
      "gi"
    )
  );

  return (
    <div>
      {splittedKeywordText.map((part, i) => (
        <span
          key={i}
          style={searchTerms.includes(part) ? keywordColoring : undefined}
        >
          {searchTerms.includes(part) ? (
            <Popover
              overlayStyle={{ width: "300px" }}
              content={descriptiveSearchTerms.get(part)}
            >
              <span style={{ cursor: "pointer" }}>{part}</span>
            </Popover>
          ) : (
            <span>{part}</span>
          )}
        </span>
      ))}
    </div>
  );
};
export default SearchTerms;



