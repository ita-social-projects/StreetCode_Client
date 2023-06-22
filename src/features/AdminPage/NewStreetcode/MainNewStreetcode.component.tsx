/* eslint-disable complexity */
import './MainNewStreetcode.styles.scss';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubtitlesApi from '@app/api/additional-content/subtitles.api';
import VideosApi from '@app/api/media/videos.api';
import PartnersApi from '@app/api/partners/partners.api';
import SourcesApi from '@app/api/sources/sources.api';
import RelatedFigureApi from '@app/api/streetcode/related-figure.api';
import TextsApi from '@app/api/streetcode/text-content/texts.api';
import useMobx from '@app/stores/root-store';
import PageBar from '@features/AdminPage/PageBar/PageBar.component';
import StreetcodeCoordinate from '@models/additional-content/coordinate.model';
import { ModelState } from '@models/enums/model-state';
import { RelatedFigureCreateUpdate, RelatedFigureUpdate } from '@models/streetcode/related-figure.model';

import { Button, ConfigProvider, Form, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ukUA from 'antd/locale/uk_UA';

import StreetcodeArtApi from '@/app/api/media/streetcode-art.api';
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import TransactionLinksApi from '@/app/api/transactions/transactLinks.api';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import Subtitle, { SubtitleCreate } from '@/models/additional-content/subtitles.model';
import { StreetcodeTag, StreetcodeTagUpdate } from '@/models/additional-content/tag.model';
import StatisticRecord from '@/models/analytics/statisticrecord.model';
import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';
import Video, { VideoCreate } from '@/models/media/video.model';
import { PartnerCreateUpdateShort, PartnerUpdate } from '@/models/partners/partners.model';
import { StreetcodeCategoryContent, StreetcodeCategoryContentUpdate } from '@/models/sources/sources.model';
import { StreetcodeCreate, StreetcodeType, StreetcodeUpdate } from '@/models/streetcode/streetcode-types.model';
import { Fact, Text, TextCreateUpdate } from '@/models/streetcode/text-contents.model';
import TimelineItem from '@/models/timeline/chronology.model';
import TransactionLink from '@/models/transactions/transaction-link.model';

import ARBlock from './ARBlock/ARBlock.component';
import ArtGalleryBlock from './ArtGallery/ArtGallery.component';
import ForFansBlock from './ForFansBlock/ForFansBlock.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import InterestingFactsBlock from './InterestingFactsBlock/InterestingFactsBlock.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';
import MapBlockAdmin from './MapBlock/MapBlockAdmin.component';
import PartnerBlockAdmin from './PartnerBlock/PartnerBlockAdmin.components';
import SubtitleBlock from './SubtitileBlock/SubtitleBlock.component';
import TextBlock from './TextBlock/TextBlock.component';
import TimelineBlockAdmin from './TimelineBlock/TimelineBlockAdmin.component';

const NewStreetcode = () => {
    const publish = 'Опублікувати';
    const draft = 'Зберегти як чернетку';
    const [form] = useForm(); // causes warning
    const {
        factsStore,
        timelineItemStore,
        newStreetcodeInfoStore,
        sourceCreateUpdateStreetcode,
        streetcodeCoordinatesStore,
        createUpdateMediaStore,
        statisticRecordStore,
        streetcodeArtStore,
        tagsStore,
    } = useMobx();

    const localOffset = new Date().getTimezoneOffset() * 60000; // Offset in milliseconds

    const [partners, setPartners] = useState<PartnerCreateUpdateShort[]>([]);
    const [selectedTags, setSelectedTags] = useState<StreetcodeTag[]>([]);
    const [inputInfo, setInputInfo] = useState<Partial<Text>>();
    const [video, setVideo] = useState<Video>();
    const [streetcodeType, setStreetcodeType] = useState<StreetcodeType>(StreetcodeType.Person);
    const [subTitle, setSubTitle] = useState<Partial<Subtitle>>();
    const [figures, setFigures] = useState<RelatedFigureCreateUpdate[]>([]);
    const [firstDate, setFirstDate] = useState<Date>();
    const [dateString, setDateString] = useState<string>();
    const [secondDate, setSecondDate] = useState<Date>();
    const [arts, setArts] = useState<StreetcodeArtCreateUpdate[]>([]);
    const [arLink, setArLink] = useState<TransactionLink>();
    const [funcName, setFuncName] = useState<string>('create');
    const [visibleModal, setVisibleModal] = useState(false);

    const { id } = useParams<any>();
    const parseId = id ? +id : null;
    const navigate = useNavigate();

    const handleRemove = useCallback(() => {
        setVisibleModal(true);
    }, []);

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
    }, []);

    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }

        if (parseId) {
            StreetcodeArtApi.getStreetcodeArtsByStreetcodeId(parseId).then((result) => {
                const artToUpdate = result.map((streetcodeArt) => ({
                    ...streetcodeArt,
                    art: {
                        ...streetcodeArt.art,
                        image: {
                            ...streetcodeArt.art.image,
                            title: streetcodeArt.art.title ?? '',
                        },
                    },
                    modelState: ModelState.Updated,
                    isPersisted: true,
                }));
                setArts([...artToUpdate]);
            });
            StreetcodesApi.getById(parseId).then((x) => {
                form.setFieldsValue({
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

                const tagsToUpdate: StreetcodeTagUpdate[] = x.tags.map((tag) => ({
                    ...tag,
                    isPersisted: true,
                    modelState: ModelState.Updated,
                    streetcodeId: parseId,
                }));

                setSelectedTags(tagsToUpdate as StreetcodeTag[]);

                if (x.lastName && x.firstName) {
                    form.setFieldsValue({
                        surname: x.lastName,
                        name: x.firstName,
                    });
                    setStreetcodeType(StreetcodeType.Person);
                } else {
                    setStreetcodeType(StreetcodeType.Event);
                }

                setFuncName('update');
            });
            TextsApi.getByStreetcodeId(parseId).then((result) => {
                setInputInfo(result);
            });
            VideosApi.getByStreetcodeId(parseId).then((result) => {
                setVideo(result);
            });
            RelatedFigureApi.getByStreetcodeId(parseId).then((result) => {
                const persistedFigures: RelatedFigureCreateUpdate[] = result.map((item) => ({
                    id: item.id,
                    title: item.title,
                    isPersisted: true,
                    modelState: ModelState.Updated,
                }));
                setFigures(persistedFigures);
            });
            PartnersApi.getToUpdateByStreetcodeId(parseId).then((result) => {
                const persistedPartners: PartnerCreateUpdateShort[] = result.map((item) => ({
                    id: item.id,
                    title: item.title,
                    isPersisted: true,
                    modelState: ModelState.Updated,
                }));

                setPartners(persistedPartners);
            });
            SubtitlesApi.getSubtitlesByStreetcodeId(parseId)
                .then((result) => {
                    setSubTitle(result);
                })
                .catch((error) => {});
            SourcesApi.getCategoriesByStreetcodeId(parseId).then((result) => {
                const id = result.map((x) => x.id);
                id.map((x) => {
                    SourcesApi.getCategoryContentByStreetcodeId(parseId, x).then((x) => {
                        const newSource: StreetcodeCategoryContent = {
                            sourceLinkCategoryId: x.sourceLinkCategoryId,
                            streetcodeId: x.streetcodeId,
                            id: x.id,
                            text: x.text,
                        };
                        const existingSource = sourceCreateUpdateStreetcode
                            .streetcodeCategoryContents.find((s) => s
                                .sourceLinkCategoryId === newSource.sourceLinkCategoryId);

                        if (!existingSource) {
                            const persistedItem: StreetcodeCategoryContentUpdate = {
                                ...newSource,
                                isPersisted: true,
                                modelState: ModelState.Updated,
                            };

                            sourceCreateUpdateStreetcode.setItem(persistedItem);
                        }
                    });
                });
            });
            TransactionLinksApi.getByStreetcodeId(parseId)
                .then((res) => {
                    if (res) {
                        setArLink(res);
                        form.setFieldValue('arlink', res.qrCodeUrl.href);
                    }
                });
            factsStore.fetchFactsByStreetcodeId(parseId);
            timelineItemStore.fetchTimelineItemsByStreetcodeId(parseId);
            statisticRecordStore.fetchStatisticRecordsByStreetcodeId(parseId);
        }
    }, []);

    const onFinish = (data: any) => {
        let tempStatus = 0;
        if (data.target.getAttribute('name') as string) {
            const buttonName = data.target.getAttribute('name') as string;
            if (buttonName.includes(publish)) {
                tempStatus = 1;
            }
        }
        form.validateFields();
        data.stopPropagation();

        const subtitles: SubtitleCreate[] = [{ subtitleText: subTitle?.subtitleText || '' }];

        const videos: VideoCreate[] = [{ url: inputInfo?.link || '' }];

        const text: TextCreateUpdate = {
            id: inputInfo?.id || 0,
            title: inputInfo?.title,
            textContent: inputInfo?.textContent,
            additionalText: inputInfo?.additionalText === '<p>Текст підготовлений спільно з</p>'
                ? '' : inputInfo?.additionalText,
            streetcodeId: parseId,
        };

        const firstDateCreate = form.getFieldValue('firstDate')
            ? new Date(form.getFieldValue('firstDate').toString()) : (parseId ? firstDate : null);

        const secondDateCreate = form.getFieldValue('secondDate')
            ? new Date(form.getFieldValue('secondDate').toString()) : (parseId ? secondDate : null);

        const streetcode: StreetcodeCreate = {
            id: parseId,
            index: form.getFieldValue('streetcodeNumber'),
            title: form.getFieldValue('title'),
            alias: form.getFieldValue('alias'),
            transliterationUrl: form.getFieldValue('streetcodeUrlName'),
            arBlockURL: form.getFieldValue('arlink'),
            streetcodeType,
            eventStartOrPersonBirthDate: firstDateCreate ? new Date(firstDateCreate - localOffset) : null,
            eventEndOrPersonDeathDate: secondDateCreate ? new Date(secondDateCreate - localOffset) : null,
            images: createUpdateMediaStore.imagesUpdate,
            audioId: createUpdateMediaStore.audioId,
            tags: selectedTags,
            relatedFigures: figures,
            text: text.title && text.textContent ? text : null,
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
            streetcodeArts: arts,
            subtitles,
            firstName: null,
            lastName: null,
            videos,
            status: tempStatus,
            toponyms: newStreetcodeInfoStore.selectedToponyms,
            streetcodeCategoryContents:
                JSON.parse(JSON.stringify(sourceCreateUpdateStreetcode.streetcodeCategoryContents))
                    .map((streetcodeCategoryContent: StreetcodeCategoryContent) => (
                        { ...streetcodeCategoryContent, id: 0 }
                    )),
            statisticRecords: JSON.parse(JSON.stringify(statisticRecordStore.getStatisticRecordArray))
                .map((statisticRecord: StatisticRecord) => (
                    {
                        ...statisticRecord,
                        id: 0,
                        coordinateId: 0,
                        streetcodeCoordinate: {
                            ...statisticRecord.streetcodeCoordinate,
                            id: 0,
                        },
                    }
                )),

        };
        if (streetcodeType === StreetcodeType.Person) {
            streetcode.firstName = form.getFieldValue('name');
            streetcode.lastName = form.getFieldValue('surname');
        }
        if (parseId) {
            const relatedFiguresUpdate: RelatedFigureUpdate[] = figures.map((figure) => ({
                observerId: parseId,
                targetId: figure.id,
                modelState: figure.modelState,
            }));

            const partnersUpdate: PartnerUpdate[] = partners.map((partner) => ({
                streetcodeId: parseId,
                partnerId: partner.id,
                modelState: partner.modelState,
            }));

            const videosUpdate: Video[] = [{ ...video, url: inputInfo?.link ?? '' } as Video];

            const subtitleUpdate: Subtitle[] = [
                { ...subTitle, subtitleText: subTitle?.subtitleText ?? '' } as Subtitle];

            const tags = [...(selectedTags as StreetcodeTagUpdate[])
                .map((item) => ({ ...item, streetcodeId: parseId })),
            ...tagsStore.getTagToDeleteArray];

            const arUrl = form.getFieldValue('arlink');
            const arLinkUpdated: TransactionLink = {
                ...arLink,
                id: arLink?.id ?? 0,
                streetcodeId: parseId,
                url: {
                    ...arLink?.url,
                    href: arUrl || '',
                },
                qrCodeUrl: {
                    ...arLink?.url,
                    href: arUrl || '',
                },
            };

            const streetcodeUpdate: StreetcodeUpdate = {
                id: parseId,
                index: form.getFieldValue('streetcodeNumber'),
                firstName: null,
                lastName: null,
                title: form.getFieldValue('title'),
                alias: form.getFieldValue('alias'),
                transliterationUrl: form.getFieldValue('streetcodeUrlName'),
                streetcodeType,
                eventStartOrPersonBirthDate: firstDateCreate ? new Date(firstDateCreate - localOffset) : null,
                eventEndOrPersonDeathDate: secondDateCreate ? new Date(secondDateCreate - localOffset) : null,
                teaser: form.getFieldValue('teaser'),
                dateString: form.getFieldValue('dateString') ?? dateString,
                videos: videosUpdate,
                relatedFigures: relatedFiguresUpdate,
                timelineItems: timelineItemStore.getTimelineItemArrayToUpdate,
                facts: factsStore.getFactArrayToUpdate.map((item) => ({ ...item, streetcodeId: parseId })),
                partners: partnersUpdate,
                subtitles: subtitleUpdate,
                text: text.title && text.textContent ? text : null,
                streetcodeCategoryContents: sourceCreateUpdateStreetcode.getCategoryContentsArrayToUpdate
                    .map((content) => ({ ...content, streetcodeId: parseId })),
                streetcodeArts: [...arts.map((art) => ({ ...art, streetcodeId: parseId })),
                    ...streetcodeArtStore.getStreetcodeArtsToDelete],
                tags,
                statisticRecords: statisticRecordStore.getStatisticRecordArrayToUpdate
                    .map((record) => ({ ...record, streetcodeId: parseId })),
                toponyms: newStreetcodeInfoStore.selectedToponyms,
                images: createUpdateMediaStore.imagesUpdate,
                audios: createUpdateMediaStore.audioUpdate,
                arLink: arLinkUpdated,
            };
            if (streetcodeType === StreetcodeType.Person) {
                streetcodeUpdate.firstName = form.getFieldValue('name');
                streetcodeUpdate.lastName = form.getFieldValue('surname');
            }
            console.log(streetcodeUpdate);
            StreetcodesApi.update(streetcodeUpdate).then((response) => {
                alert('Cтріткод успішно оновленний');
            })
                .catch((error2) => {
                    alert('Виникла помилка при оновленні стріткоду');
                });
        } else {
            console.log(streetcode);
            StreetcodesApi.create(streetcode)
                .then(() => {
                    if (tempStatus === 1) {
                        navigate(`../${form.getFieldValue('streetcodeUrlName')}`, { replace: true });
                    } else {
                        navigate(`${FRONTEND_ROUTES.ADMIN.BASE}/${form.getFieldValue('streetcodeUrlName')}`);
                    }
                })
                .catch((error) => {
                    alert('Виникла помилка при створенні стріткоду');
                });
        }
    };

    return (
        <div className="NewStreetcodeContainer">
            <PageBar />
            <ConfigProvider locale={ukUA}>
                <div className="adminContainer">
                    <div className="adminContainer-block">
                        <h2>Стріткод</h2>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <MainBlockAdmin
                                form={form}
                                selectedTags={selectedTags}
                                setSelectedTags={setSelectedTags}
                                streetcodeType={streetcodeType}
                                setStreetcodeType={setStreetcodeType}
                            />
                            <TextBlock
                                inputInfo={inputInfo}
                                setInputInfo={setInputInfo}
                                video={video}
                                setVideo={setVideo}
                            />
                            <InterestingFactsBlock />
                            <TimelineBlockAdmin />
                            <MapBlockAdmin />
                            <ArtGalleryBlock arts={arts} setArts={setArts} />
                            <RelatedFiguresBlock figures={figures} setFigures={setFigures} />
                            <ForFansBlock />
                            <PartnerBlockAdmin partners={partners} setPartners={setPartners} />
                            <SubtitleBlock subTitle={subTitle} setSubTitle={setSubTitle} />
                            <ARBlock />
                        </Form>
                    </div>
                    <Button
                        className="streetcode-custom-button submit-button"
                        onClick={onFinish}
                        name={draft}
                    >
                        {draft}
                    </Button>
                    <Modal
                        title="Ви впевнені, що хочете опублікувати цей стріткод?"
                        open={visibleModal}
                        onOk={onFinish}
                        onCancel={handleCancelModalRemove}
                    />
                    <Button
                        className="streetcode-custom-button submit-button"
                        onClick={handleRemove}
                        name={publish}
                    >
                        {publish}
                    </Button>

                </div>
            </ConfigProvider>
        </div>
    );
};

export default NewStreetcode;
