import { makeAutoObservable } from 'mobx';

import { RelatedTerm } from '@/models/streetcode/text-contents.model';

export default class RelatedTermsStore {
    private storage = new Map<number, RelatedTerm>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setRelatedTermItem = (relatedTerm: RelatedTerm) => {
        this.storage.set(relatedTerm.id, relatedTerm);
    };

    private set setRelatedTermMap(relatedTerms: RelatedTerm[]) {
        relatedTerms.forEach((rt) => {
            this.setRelatedTermItem(rt);
        });
    }

    get getRelatedTermsArray() {
        return Array.from(this.storage.values());
    }
}
