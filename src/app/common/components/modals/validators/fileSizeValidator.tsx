// eslint-disable-next-line import/no-extraneous-dependencies
import { RuleObject } from 'rc-field-form/lib/interface';

import { UploadFileStatus } from 'antd/es/upload/interface';

import { MaxFileSizeMB } from '@/app/common/constants/enums/file-size.enum';
import { MESSAGES } from '@/app/common/constants/messages/messages';

const fileSizeValidator = (maxFileSize: MaxFileSizeMB) => (_: RuleObject, file: any): Promise<void> => {
    if (file?.file?.status === 'removed' as UploadFileStatus) {
        return Promise.resolve();
    }

    const maxSizeInBytes = maxFileSize * 1024 * 1024;
    const fileSize = file.file?.size || file.size || 0;

    if (fileSize > maxSizeInBytes) {
        return Promise.reject(
            new Error(MESSAGES.VALIDATION.FILE_SIZE(maxFileSize)),
        );
    }

    return Promise.resolve();
};

export default fileSizeValidator;
