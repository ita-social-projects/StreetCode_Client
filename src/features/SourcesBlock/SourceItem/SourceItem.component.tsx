import "./SourceItem.styles.scss"

import useMobx from "@stores/root-store";
import { observer } from "mobx-react-lite";

interface Props {
    text: string;
}

const SourceItem = (props: Props) => {
    const { modalStore: { setModal } } = useMobx();

    return (
        <div className='sourcesSliderItem' onClick={() => setModal('sources')}>
            <h1>{props.text}</h1>
        </div>
    );
}

export default observer(SourceItem);