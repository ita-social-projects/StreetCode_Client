import './MainNewStreetcode.styles.scss';

import React, { useEffect, useState } from 'react';
import RelatedFigure from '@models/streetcode/related-figure.model';

import { ConfigProvider, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ukUA from 'antd/locale/uk_UA';
import RelatedFigureApi from '@app/api/streetcode/related-figure.api'
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import useMobx from '@/app/stores/root-store';
import Subtitle, { SubtitleCreate } from '@/models/additional-content/subtitles.model';
import { StreetcodeTag } from '@/models/additional-content/tag.model';
import { ArtCreate, ArtCreateDTO } from '@/models/media/art.model';
import Video, { VideoCreate } from '@/models/media/video.model';
import Partner, { PartnerShort } from '@/models/partners/partners.model';
import { SourceCategory, StreetcodeCategoryContent } from '@/models/sources/sources.model';
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
import { useParams } from 'react-router-dom';
import StreetcodeArtApi from '../../../app/api/media/streetcode-art.api';
import VideosApi from '../../../app/api/media/videos.api';
import PartnersApi from '../../../app/api/partners/partners.api';
import SubtitlesApi from '../../../app/api/additional-content/subtitles.api';
import FactsApi from '../../../app/api/streetcode/text-content/facts.api';
import TextsApi from '../../../app/api/streetcode/text-content/texts.api';
import SourcesApi from '../../../app/api/sources/sources.api';
import StreetcodeCoordinateApi from '../../../app/api/additional-content/streetcode-cooridnates.api';
import StreetcodeCoordinate from '../../../models/additional-content/coordinate.model';
const NewStreetcode = () => {
    const [form] = useForm();
    const { factsStore, timelineItemStore, newStreetcodeInfoStore, sourceCreateUpdateStreetcode } = useMobx();

    const [partners, setPartners] = useState<Partner[]>([]);
    const [selectedTags, setSelectedTags] = useState<StreetcodeTag[]>([]);
    const [inputInfo, setInputInfo] = useState<Partial<TextInputInfo>>();
    const [video, setVideo] = useState<Video>();
    const [streetcodeType, setStreetcodeType] = useState<StreetcodeType>(StreetcodeType.Person);
    const [subTitle, setSubTitle] = useState<string>('');
    const [figures, setFigures] = useState<RelatedFigure[]>([]);
    const [categories, setCategories] = useState<SourceCategory[]>([]);
    const [coordinates, setCoordinates] = useState<StreetcodeCoordinate[]>([]);
    const [facts, setFacts] = useState<Fact[]>([]);
    const [arts, setArts] = useState<ArtCreate[]>([]);
    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }
        if (parseId) {
            StreetcodeArtApi.getStreetcodeArtsByStreetcodeId(parseId).then(result => {
                const newArts = result.map(x => ({
                    description: x.art.description ?? "",
                    title: x.art.image.alt ?? "",
                    imageId: x.art.imageId,
                    image: x.art.image.base64,
                    index: x.index,
                    mimeType: x.art.image.mimeType,
                    uidFile: x.index + ""
                }));
                setArts([...newArts]);
            });
            StreetcodesApi.getById(parseId).then(x => {
                if (x.lastName && x.firstName) {

                    form.setFieldsValue({
                        surname: x.lastName,
                        name: x.firstName,
                        streetcodeNumber: parseId,
                        title: x.title,
                        alias: x.alias,
                        streetcodeUrlName: x.transliterationUrl,
                        firstDate: x.eventStartOrPersonBirthDate,
                        secondDate: x.eventEndOrPersonDeathDate,
                        //streetcodeFirstDate: x.eventStartOrPersonBirthDate,
                        //streetcodeSecondDate: x.eventEndOrPersonDeathDate,
                        teaser: x.teaser,
                    });
                    setSelectedTags(x.tags);
                    setStreetcodeType(StreetcodeType.Person);
                }
                else {
                    form.setFieldsValue({
                        streetcodeNumber: parseId,
                        title: x.title,
                        alias: x.alias,
                        streetcodeUrlName: x.transliterationUrl,
                        firstDate: x.eventStartOrPersonBirthDate,
                        secondDate: x.eventEndOrPersonDeathDate,
                        //streetcodeFirstDate: x.eventStartOrPersonBirthDate,
                        //streetcodeSecondDate: x.eventEndOrPersonDeathDate,
                        teaser: x.teaser,
                    });
                    setSelectedTags(x.tags);
                    setStreetcodeType(StreetcodeType.Event);
                }
            });
            TextsApi.getByStreetcodeId(parseId).then(result => {
                setInputInfo(result);
            })
            VideosApi.getByStreetcodeId(parseId).then(result => {
                setVideo(result);
            })
            RelatedFigureApi.getByStreetcodeId(parseId).then(result => {
                setFigures([...result]);
            });
            PartnersApi.getByStreetcodeId(parseId).then(result => {
                setPartners([...result]);
            });
            SubtitlesApi.getSubtitlesByStreetcodeId(parseId).then(result => {
                setSubTitle(result[0].subtitleText);
            });
            SourcesApi.getCategoriesByStreetcodeId(parseId).then(result => {
                setCategories([...result]);
            });
            StreetcodeCoordinateApi.getByStreetcodeId(parseId).then(result => {
                setCoordinates([...result]);
            });
        
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
                newStreetcodeInfoStore.animationId,
                newStreetcodeInfoStore.blackAndWhiteId,
                newStreetcodeInfoStore.relatedFigureId,
            ].filter((id) => id !== null),
            audioId: newStreetcodeInfoStore.audioId,
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
            streetcodeCategoryContents:
                JSON.parse(JSON.stringify(sourceCreateUpdateStreetcode.streetcodeCategoryContents))
                    .map((streetcodeCategoryContent: StreetcodeCategoryContent) => (
                        { ...streetcodeCategoryContent, id: 0 }
                    )),
        };
        if (streetcodeType === StreetcodeType.Person) {
            streetcode.firstName = form.getFieldValue('name');
            streetcode.lastName = form.getFieldValue('surname');
        }


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
                        <TextBlock inputInfo={inputInfo} setInputInfo={setInputInfo} video={video} setVideo={ setVideo} />
                        <button type="submit">Відправити</button>
                    </Form>
                    <InterestingFactsBlock facts={facts} setFacts={setFacts} />
                    <RelatedFiguresBlock figures={figures } setFigures={setFigures} />
                    <PartnerBlockAdmin partners={ partners} setPartners={setPartners} />
                    <SubtitleBlock subTitle={subTitle} setSubTitle={setSubTitle} />
                    <ArtGalleryBlock arts={arts} setArts={setArts} />
                    <TimelineBlockAdmin />
                    <ForFansBlock categories={categories} setCategories={setCategories} />
                    <MapBlockAdmin coordinates={coordinates} />
                </div>
            </ConfigProvider>
        </div>
    );
};

export default NewStreetcode;
