import './InterestingFactsBlock.style.scss';

import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';

// import PageBar from '../../PageBar/PageBar.component';
import InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component'; //InterestingFactAdminItem from './InterestingFactsAdminItem/InterestingFactsAdminItem.component';

const InterestingFactsBlock = () => {
    const streetcodeId = 2;// useRouteId();
    const { factsStore: { fetchFactsByStreetcodeId, getFactArray } } = useMobx();

    useAsync(
        () => fetchFactsByStreetcodeId(streetcodeId),
        [streetcodeId],
    );

    return (
        <div className="interestingFactsBlock">
            <div className="heading">
                <h2>
                   Wow-факти
                </h2>
            </div>
            <div className="factsContainer">
                {getFactArray.map((fact) => (
                    <InterestingFactAdminItem
                        fact={fact}
                    />
                ))}
            </div>
        </div>
    );
};

export default InterestingFactsBlock;
