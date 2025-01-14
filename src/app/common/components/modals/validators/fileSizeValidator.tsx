// eslint-disable-next-line import/no-extraneous-dependencies
import { RuleObject } from 'rc-field-form/lib/interface';

import { MaxFileSizeMB } from '@/app/common/constants/enums/file-size.enum';

const fileSizeValidator = (maxFileSize: MaxFileSizeMB) => (_: RuleObject, file: any): Promise<void> => {
    if (file) {
        const maxSizeInBytes = maxFileSize * 1024 * 1024;
        let size = 0;

        if (file.file) {
            size = file.file.size;
        } else if (file.size) {
            size = file.size;
        }

        if (size <= maxSizeInBytes) {
            return Promise.resolve();
        }

        return Promise.reject(
            new Error(`Розмір файлу не має бути більше ${maxFileSize} MB!`),
        );
    }

    return Promise.reject(new Error('Не вдалося перевірити розмір файлу!'));
};

export default fileSizeValidator;
