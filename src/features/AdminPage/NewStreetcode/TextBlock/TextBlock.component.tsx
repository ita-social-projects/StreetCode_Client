

import TextInputInfo from './InputType/TextInputInfo.model';
import TextForm from './TextForm/TextForm.component';

interface Props {
    inputInfo: Partial<TextInputInfo> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<TextInputInfo> | undefined>>;
}
const TextBlock = ({ inputInfo, setInputInfo }: Props) => (
        <TextForm inputInfo={inputInfo} setInputInfo={setInputInfo} />
);

export default TextBlock;
