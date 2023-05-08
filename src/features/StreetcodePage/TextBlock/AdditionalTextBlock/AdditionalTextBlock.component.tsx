/* eslint-disable react/jsx-no-useless-fragment */
import './AdditionalTextBlock.styles.scss';

import { useEffect } from 'react';

interface Props {
    аdditionalText: string | undefined;
}

const AdditionalText = ({ аdditionalText }: Props) => {
    useEffect(() => {
        console.log(аdditionalText);
    }, [аdditionalText]);

    return (
        <div className="additionalText">
            {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
            <>
                {аdditionalText || null}
            </>
        </div>
    );
};

export default AdditionalText;
