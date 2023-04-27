import './MainNewStreetcode.styles.scss';

import React, { useEffect, useState } from 'react';
import RelatedFigure from '@models/streetcode/related-figure.model';

import { ConfigProvider, Form, Button } from 'antd';
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
import { StreetcodeCreate, StreetcodeType } from '@/models/streetcode/streetcode-types.model';
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
import TimelineApi from '../../../app/api/timeline/timeline.api';
const NewStreetcode = () => {
    const [form] = useForm();
    const {
        factsStore,
        timelineItemStore,
        newStreetcodeInfoStore,
        sourceCreateUpdateStreetcode,
        streetcodeCoordinatesStore,
    } = useMobx();

    const [partners, setPartners] = useState<Partner[]>([]);
    const [selectedTags, setSelectedTags] = useState<StreetcodeTag[]>([]);
    const [inputInfo, setInputInfo] = useState<Partial<TextInputInfo>>();
    const [video, setVideo] = useState<Video>();
    const [streetcodeType, setStreetcodeType] = useState<StreetcodeType>(StreetcodeType.Person);
    const [subTitle, setSubTitle] = useState<string>('');
    const [figures, setFigures] = useState<RelatedFigure[]>([]);
    const [categories, setCategories] = useState<SourceCategory[]>([]);
    const [coordinates, setCoordinates] = useState<StreetcodeCoordinate[]>([]);
    const [firstDate, setFirstDate] = useState<Date>();
    const [dateString, setDateString] = useState<string>();
    const [secondDate, setSecondDate] = useState<Date>();
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [facts, setFacts] = useState<Fact[]>([]);
    const [arts, setArts] = useState<ArtCreate[]>([]);
    const { id } = useParams<any>();
    const parseId = id ? +id : null;
    if (parseId)
        timelineItemStore.fetchTimelineItemsByStreetcodeId(parseId);
    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }
        if (parseId) {
            StreetcodeArtApi.getStreetcodeArtsByStreetcodeId(parseId).then(result => {
                const newArts = result.map(x => ({
                    description: x.art.description ?? '',
                    title: x.art.image.alt ?? '',
                    imageId: x.art.imageId,
                    image: x.art.image.base64,
                    index: x.index,
                    mimeType: x.art.image.mimeType,
                    uidFile: `${x.index}`,
                }));
                setArts([...newArts]);
            });
            StreetcodesApi.getById(parseId).then(x => {
                if (x.lastName && x.firstName) {

                    form.setFieldsValue({
                        surname: x.lastName,
                        name: x.firstName,
                        streetcodeNumber: x.index,
                        title: x.title,
                        alias: x.alias,
                        streetcodeUrlName: x.transliterationUrl,
                        firstDate: x.eventStartOrPersonBirthDate,
                        secondDate: x.eventEndOrPersonDeathDate,
                        teaser: x.teaser,
                        video,
                    });
                    setFirstDate(x.eventStartOrPersonBirthDate);
                    setSecondDate(x.eventEndOrPersonDeathDate);
                    setDateString(x.dateString);
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

                        teaser: x.teaser,
                        video: 'asdasd'
                    });
                    setFirstDate(x.eventStartOrPersonBirthDate);
                    setSecondDate(x.eventEndOrPersonDeathDate);
                    setDateString(x.dateString);
                    setSelectedTags(x.tags);
                    setStreetcodeType(StreetcodeType.Event);
                }
            });
            TextsApi.getByStreetcodeId(parseId).then(result => {
                setInputInfo(result);
            });
            VideosApi.getByStreetcodeId(parseId).then(result => {
                setVideo(result);
            });
            RelatedFigureApi.getByStreetcodeId(parseId).then(result => {
                setFigures([...result]);
            });
            PartnersApi.getByStreetcodeId(parseId).then(result => {
                setPartners([...result]);
            });
            SubtitlesApi.getSubtitlesByStreetcodeId(parseId).then((result) => {
                setSubTitle(result[0].subtitleText);
            });
            SourcesApi.getCategoriesByStreetcodeId(parseId).then(result => {
                const id = result.map(x => x.id);
                id.map(x => {
                    SourcesApi.getCategoryContentByStreetcodeId(parseId, x).then(x => {
                        const newSource: StreetcodeCategoryContent = {
                            sourceLinkCategoryId: x.sourceLinkCategoryId,
                            streetcodeId: x.streetcodeId,
                            id: x.id,
                            text: x.text
                        }
                        const existingSource = sourceCreateUpdateStreetcode.streetcodeCategoryContents.find(s => s.sourceLinkCategoryId === newSource.sourceLinkCategoryId);

                        if (!existingSource) {
                            sourceCreateUpdateStreetcode.addSourceCategoryContent(newSource);

                        }
                    });
                });
            });
            StreetcodeCoordinateApi.getByStreetcodeId(parseId).then(result => {
                setCoordinates([...result]);
            });
            FactsApi.getFactsByStreetcodeId(parseId).then(result => {
                setFacts([...result]);
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
            eventStartOrPersonBirthDate: form.getFieldValue('streetcodeFirstDate') ? form.getFieldValue('streetcodeFirstDate').toDate() : ( parseId?firstDate: null ),
            eventEndOrPersonDeathDate: form.getFieldValue('streetcodeSecondDate') ? form.getFieldValue('streetcodeSecondDate').toDate() : ( parseId?secondDate: null ),
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
            coordinates: JSON.parse(JSON.stringify(streetcodeCoordinatesStore.getStreetcodeCoordinateArray))
                .map((coordinate: StreetcodeCoordinate) => ({ ...coordinate, id: 0 })),
            partners,
            teaser: form.getFieldValue('teaser'),
            viewCount: 0,
            createdAt: new Date().toISOString(),
            dateString: form.getFieldValue('dateString') ?? dateString,
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

        if (parseId) {
            console.log(streetcode);
            StreetcodeArtApi.update(streetcode).then((response2) => {
                console.log(response2);
            })
                .catch((error2) => {
                   console.log(error2);
            });
        }
        else {
            StreetcodesApi.create(streetcode)
                .then((response) => {
                })
                .catch((error) => {
                    console.log(streetcode);
                });
        }
    };


    return (
        <div className="NewStreetcodeContainer">
            <PageBar />
            <ConfigProvider locale={ukUA}>
                <div className="adminContainer">
                    {/*<StreetCodeBlock />*/}
                    <div className='adminContainer-block'>
                        <h2>Стріткод</h2>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <MainBlockAdmin
                                form={form}
                                selectedTags={selectedTags}
                                setSelectedTags={setSelectedTags}
                                streetcodeType={streetcodeType}
                                setStreetcodeType={setStreetcodeType}
                            />
                            <TextBlock inputInfo={inputInfo} setInputInfo={setInputInfo} video={video} setVideo={setVideo} />
                        </Form>
                     </div>
                    <InterestingFactsBlock id={parseId??-1} />
                    <RelatedFiguresBlock figures={figures} setFigures={setFigures} />
                    <PartnerBlockAdmin partners={partners} setPartners={setPartners} />
                    <SubtitleBlock subTitle={subTitle} setSubTitle={setSubTitle} />
                    <ArtGalleryBlock arts={arts} setArts={setArts} />
                    <TimelineBlockAdmin timeline={timeline} setTimeline={setTimeline} />
                    <ForFansBlock  />
                    <MapBlockAdmin coordinates={coordinates} />
                    <Button className = 'streetcode-custom-button submit-button' onClick={onFinish}>Відправити</Button>
                </div>             
            </ConfigProvider>
        </div>
    );
};

export default NewStreetcode;
