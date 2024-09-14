import { RuleObject } from 'rc-field-form/lib/interface';

const imageValidator = (_: RuleObject, file: any): Promise<void> => {
    if (file) {
        let name = '';
        if (file.file) {
            name = file.file.name.toLowerCase();
        } else if (file.name) {
            name = file.name.toLowerCase();
        }

        const allowedExtensions = ['.jpeg', '.png', '.webp', '.jpg'];

        if (allowedExtensions.some((ext) => name.endsWith(ext))) {
            return Promise.resolve();
        }

        return Promise.reject(new Error('Тільки файли з розширенням webp, jpeg, png, jpg дозволені!'));
    }

    return Promise.reject();
};

export default imageValidator;
