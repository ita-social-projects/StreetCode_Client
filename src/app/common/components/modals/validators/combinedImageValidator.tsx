import fileSizeValidator from '@components/modals/validators/fileSizeValidator';
import imageExtensionValidator from '@components/modals/validators/imageExtensionValidator';
import MaxFileSizeMB from '@constants/enums/file-size.enum';

import { RuleObject } from 'antd/es/form';
import { UploadFile } from 'antd/es/upload';

const combinedImageValidator = (isRequired: boolean) => async (_: RuleObject, file: UploadFile): Promise<void> => {
    if (!file) {
        return isRequired
            ? Promise.reject()
            : Promise.resolve();
    }
    try {
        await imageExtensionValidator(_, file);
        return await fileSizeValidator(MaxFileSizeMB.Image)(_, file);
    } catch (error) {
        return await Promise.reject(error);
    }
};

const checkFile = async (file: UploadFile): Promise<boolean> => {
    const validator = combinedImageValidator(true);
    return validator({}, file)
        .then(() => true)
        .catch(() => false);
};

export default combinedImageValidator;

export { checkFile };
