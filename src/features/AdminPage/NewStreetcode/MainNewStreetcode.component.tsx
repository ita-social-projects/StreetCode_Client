import './MainNewStreetcode.styles.scss';

import React, { useEffect, useState } from 'react';

import { Button, ConfigProvider, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UploadFile } from 'antd/lib/upload/interface';
import ukUA from 'antd/locale/uk_UA';

import useMobx from '@/app/stores/root-store';
import Tag, { TagVisible } from '@/models/additional-content/tag.model';
import Video, { VideoCreate } from '@/models/map/media/video.model';
import { AudioCreate } from '@/models/media/audio.model';
import Image from '@/models/media/image.model';
import { PartnerShort } from '@/models/partners/partners.model';
import Streetcode, { MainBlockDataCreate, StreetcodeCreate, StreetcodeType } from '@/models/streetcode/streetcode-types.model';
import { Fact } from '@/models/streetcode/text-contents.model';

import PageBar from '../PageBar/PageBar.component';

import ArtGalleryBlock from './ArtGallery/ArtGallery.component';
import ForFansBlock from './ForFans/ForFans.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import InterestingFactsBlock from './InterestingFactsBlock/InterestingFactsBlock.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';
import PartnerBlockAdmin from './PartnerBlock/PartnerBlockAdmin.components';
import TextInputInfo from './TextBlock/InputType/TextInputInfo.model';
import TextBlock from './TextBlock/TextBlock.component';
import TimelineBlockAdmin from './TimelineBlock/TimelineBlockAdmin.component';

type FileObject = {
    blobName: string;
    mimeType: string;
};

const NewStreetcode = () => {
    const [form] = useForm();
    const { factsStore, timelineItemStore } = useMobx();

    const [partners, setPartners] = useState<PartnerShort[]>([]);
    const [tags, setTags] = useState<TagVisible[]>([]);
    const [inputInfo, setInputInfo] = useState<Partial<TextInputInfo>>();
    const [streetcodeType, setStreetcodeType] = useState<StreetcodeType>(StreetcodeType.Person);

    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }
    }, []);

    const onChangePartners = (partner: PartnerShort[]) => setPartners(partner);
    const onChangeTags = (newTags: TagVisible[]) => setTags(newTags);
    const onChangeStreetcodeType = (newStreetcodeType: StreetcodeType) => setStreetcodeType(newStreetcodeType);

    const createFileObject = <T extends FileObject>(file: UploadFile<any>): T | undefined => {
        if (file) {
            const fileObject = {
                blobName: file.name ?? '',
                mimeType: file.type ?? '',
            } as T;
            return fileObject;
        }
        return undefined;
    };

    const onFinish = (data) => {
        const animationFile = form.getFieldValue('animations').file as UploadFile<any>;
        const pictureBlackWhiteFile = form.getFieldValue('pictureBlackWhite').file as UploadFile<any>;
        const pictureRelationsFile = form.getFieldValue('pictureRelations')?.file as UploadFile<any>;

        const audioFile = form.getFieldValue('audio')?.file;

        const images: Image[] = [
            createFileObject<Image>(animationFile),
            createFileObject<Image>(pictureBlackWhiteFile),
            createFileObject<Image>(pictureRelationsFile),
        ].filter((image) => image !== undefined) as Image[];

        const video: VideoCreate = { url: inputInfo?.link || '' };

        const streetcode: StreetcodeCreate = {
            index: form.getFieldValue('streetcodeNumber'),
            title: form.getFieldValue('title'),
            alias: form.getFieldValue('alias'),
            transliterationUrl: form.getFieldValue('streetcodeUrlName'),
            type: streetcodeType,
            eventStartOrPersonBirthDate: form.getFieldValue('streetcodeFirstDate').toDate(),
            eventEndOrPersonDeathDate: form.getFieldValue('streetcodeSecondDate').toDate(),
            tags,
            textTitle: inputInfo?.title,
            text: inputInfo?.text,
            images,
            audio: audioFile && createFileObject<AudioCreate>(audioFile),
            video,
            timelineItems: JSON.parse(JSON.stringify(timelineItemStore.getTimelineItemArray)),
            partners,
            firstName: undefined,
            lastName: undefined,
            teaser: form.getFieldValue('teaser'),
            viewCount: 0,
            createdAt: new Date().toISOString(),
        };
        if (streetcodeType === StreetcodeType.Person) {
            streetcode.firstName = form.getFieldValue('name');
            streetcode.lastName = form.getFieldValue('surname');
        }
        console.log(streetcode);
    };

    return (
        <div className="NewStreetcodeContainer">
            <PageBar />
            <ConfigProvider locale={ukUA}>
                <div className="adminPageContainer">
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <MainBlockAdmin
                            form={form}
                            onChangeTags={onChangeTags}
                            onChangeStreetcodeType={onChangeStreetcodeType}
                        />
                        <TextBlock inputInfo={inputInfo} setInputInfo={setInputInfo} />
                        <button type="submit">Відправити</button>
                    </Form>
                    <InterestingFactsBlock />
                    <ArtGalleryBlock />
                    <RelatedFiguresBlock />
                    <TimelineBlockAdmin />
                    <ForFansBlock />
                    <PartnerBlockAdmin onChange={onChangePartners} />
                </div>
            </ConfigProvider>
        </div>
    );
};

export default NewStreetcode;
