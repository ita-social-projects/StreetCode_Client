import './DictionaryTable.styles.scss';

import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

const DictionaryTable = () => {
    const { termsStore: { fetchTerms, getTermArray } } = useMobx();
    useAsync(fetchTerms);

    return (
        <div className="dictionary-wrapper">
            <div className="dictionary-header">
                <h3>Словник термінів</h3>
            </div>
            <div className="dictionary-table-wrapper">
                {getTermArray?.map(
                    (term) => (
                        <div>
                            <h4>{term.title}</h4>
                            <p>{term.description}</p>
                        </div>
                    ),
                )}
            </div>
        </div>
    );
};

export default DictionaryTable;
