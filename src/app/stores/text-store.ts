import { makeAutoObservable, runInAction } from 'mobx';
import textsApi from '@api/streetcode/text-content/texts.api';
import { Text } from '@models/streetcode/text-contents.model';

export default class TextStore {
    public TextMap = new Map<number, Text>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (texts: Text[]) => {
        texts.forEach(this.setItem);
    };

    private setItem = (text: Text) => {
        this.TextMap.set(text.id, text);
    };

    public getTextArray = () => Array.from(this.TextMap.values());

    public fetchTextByStreetcodeId = async (streetcodeId: number) => {
        try {
            const text = await textsApi.getByStreetcodeId(streetcodeId);
            runInAction(() => {
                this.TextMap.set(streetcodeId, text);
            });
        } catch (err: unknown) {
            console.log(err);
        }
    };

    public fetchText = async (id: number) => {
        try {
            const text = await textsApi.getById(id);
            this.setItem(text);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchTexts = async () => {
        try {
            const texts = await textsApi.getAll();
            this.setInternalMap(texts);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createText = async (text: Text) => {
        try {
            await textsApi.create(text);
            this.setItem(text);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateText = async (text: Text) => {
        try {
            await textsApi.update(text);
            runInAction(() => {
                const updatedText = {
                    ...this.TextMap.get(text.id),
                    ...text,
                };
                this.setItem(updatedText as Text);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteText = async (textId: number) => {
        try {
            await textsApi.delete(textId);
            runInAction(() => {
                this.TextMap.delete(textId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
