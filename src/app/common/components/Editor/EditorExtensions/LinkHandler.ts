import { Quill } from 'react-quill';

const BaseLink = Quill.import('formats/link');

class LinkHandler extends BaseLink {
    format(name: string, va: string) {
        if (['href', 'target'].indexOf(name) > -1) {
            if (va) {
                this.domNode.setAttribute(name, va);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, va);
        }
    }

    static create(va: string) {
        const node = super.create(va);
        node.setAttribute('href', this.sanitize(va));
        if (va.startsWith('https://streetcode.com.ua')) {
            node.setAttribute('target', '_self');
        } else {
            node.setAttribute('target', '_blank');
        }
        return node;
    }
}
Quill.register(LinkHandler, true);

export default LinkHandler;
