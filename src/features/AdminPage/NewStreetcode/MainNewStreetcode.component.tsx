import './MainNewStreetcode.styles.scss';

import React, { useEffect, useState } from 'react';
import RelatedFigure from '@models/streetcode/related-figure.model';

import { ConfigProvider, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ukUA from 'antd/locale/uk_UA';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import useMobx from '@/app/stores/root-store';
import { SubtitleCreate } from '@/models/additional-content/subtitles.model';
import { TagVisible } from '@/models/additional-content/tag.model';
import { ArtCreate, ArtCreateDTO } from '@/models/media/art.model';
import { VideoCreate } from '@/models/media/video.model';
import { PartnerShort } from '@/models/partners/partners.model';
import { SourceCategory } from '@/models/sources/sources.model';
import { StreetcodeCreate, StreetcodeType }
    from '@/models/streetcode/streetcode-types.model';
import { Fact, TextCreate } from '@/models/streetcode/text-contents.model';
import TimelineItem from '@/models/timeline/chronology.model';

import PageBar from '../PageBar/PageBar.component';

import ArtGalleryBlock from './ArtGallery/ArtGallery.component';
import ForFansBlock from './ForFansBlock/ForFansBlock.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import InterestingFactsBlock from './InterestingFactsBlock/InterestingFactsBlock.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';
import MapBlockAdmin from './MapBlock/MapBlockAdmin.component';
import PartnerBlockAdmin from './PartnerBlock/PartnerBlockAdmin.components';
import SubtitleBlock from './SubtitileBlock/SubtitleBlock.component';
import TextInputInfo from './TextBlock/InputType/TextInputInfo.model';
import TextBlock from './TextBlock/TextBlock.component';
import TimelineBlockAdmin from './TimelineBlock/TimelineBlockAdmin.component';

const NewStreetcode = () => {
    const [form] = useForm();
    const { factsStore, timelineItemStore, newStreetcodeInfoStore } = useMobx();

    const [partners, setPartners] = useState<PartnerShort[]>([]);
    const [selectedTags, setSelectedTags] = useState<TagVisible[]>([]);
    const [inputInfo, setInputInfo] = useState<Partial<TextInputInfo>>();
    const [streetcodeType, setStreetcodeType] = useState<StreetcodeType>(StreetcodeType.Person);
    const [subTitle, setSubTitle] = useState<string>('');
    const [figures, setFigures] = useState<RelatedFigure[]>([]);
    const [arts, setArts] = useState<ArtCreate[]>([]);
    const [categories, setCategories] = useState<SourceCategory[]>([]);

    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }
    }, []);

    const onFinish = (data) => {
        const subtitles: SubtitleCreate[] = [{
            subtitleText: subTitle,
        }];
        const videos: VideoCreate[] = [
            { url: inputInfo?.link || '' },
        ];

        const text: TextCreate = {
            title: inputInfo?.title,
            textContent: inputInfo?.text,
        };

        const streetcodeArts: ArtCreateDTO[] = arts.map((art: ArtCreate) => ({
            imageId: art.imageId,
            description: art.description,
            index: art.index,
            title: art.title,
            mimeType: art.mimeType,
        }));

        const streetcode: StreetcodeCreate = {
            index: form.getFieldValue('streetcodeNumber'),
            title: form.getFieldValue('title'),
            alias: form.getFieldValue('alias'),
            transliterationUrl: form.getFieldValue('streetcodeUrlName'),
            streetcodeType,
            eventStartOrPersonBirthDate: form.getFieldValue('streetcodeFirstDate').toDate(),
            eventEndOrPersonDeathDate: form.getFieldValue('streetcodeSecondDate').toDate(),
            imagesId: [
                newStreetcodeInfoStore.AnimationId,
                newStreetcodeInfoStore.BlackAndWhiteId,
            ],
            tags: selectedTags,
            relatedFigures: figures,
            text: (text.title && text.textContent) ? text : null,
            timelineItems: JSON.parse(JSON.stringify(timelineItemStore.getTimelineItemArray))
                .map((timelineItem: TimelineItem) => ({ ...timelineItem, id: 0 })),
            facts: JSON.parse(JSON.stringify(factsStore.getFactArray))
                .map((fact: Fact) => ({ ...fact, id: 0 })),
            partners,
            teaser: form.getFieldValue('teaser'),
            viewCount: 0,
            createdAt: new Date().toISOString(),
            dateString: form.getFieldValue('dateString'),
            streetcodeArts,
            subtitles,
            firstName: null,
            lastName: null,
            videos,
            toponyms: newStreetcodeInfoStore.selectedToponyms,
        };
        if (streetcodeType === StreetcodeType.Person) {
            streetcode.firstName = form.getFieldValue('name');
            streetcode.lastName = form.getFieldValue('surname');
        }

        console.log(streetcode);

        StreetcodesApi.create(streetcode)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="NewStreetcodeContainer">
            <PageBar />
            <ConfigProvider locale={ukUA}>
                <div className="adminPageContainer">
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <MainBlockAdmin
                            form={form}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                            streetcodeType={streetcodeType}
                            setStreetcodeType={setStreetcodeType}
                        />
                        <TextBlock inputInfo={inputInfo} setInputInfo={setInputInfo} />
                        <button type="submit">Відправити</button>
                    </Form>
                    <InterestingFactsBlock />
                    <RelatedFiguresBlock setFigures={setFigures} />
                    <PartnerBlockAdmin setPartners={setPartners} />
                    <SubtitleBlock setSubTitle={setSubTitle} />
                    <ArtGalleryBlock arts={arts} setArts={setArts} />
                    <TimelineBlockAdmin />
                    <ForFansBlock categories={categories} />
                    <MapBlockAdmin />
                </div>
            </ConfigProvider>
        </div>
    );
};

export default NewStreetcode;
