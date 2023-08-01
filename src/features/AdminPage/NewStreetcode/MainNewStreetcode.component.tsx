/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import './MainNewStreetcode.styles.scss';

import { useCallback, useEffect, useRef, useState } from 'react';
import { unstable_usePrompt as usePrompt, useNavigate, useParams } from 'react-router-dom';
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
import dayjs from 'dayjs';

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
import Image, { ImageAssigment, ImageCreateUpdate, ImageDetails } from '@/models/media/image.model';
import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';
import Video, { VideoCreate } from '@/models/media/video.model';
import { PartnerCreateUpdateShort, PartnerUpdate } from '@/models/partners/partners.model';
import { StreetcodeCategoryContent, StreetcodeCategoryContentUpdate } from '@/models/sources/sources.model';
import { StreetcodeCreate, StreetcodeType, StreetcodeUpdate } from '@/models/streetcode/streetcode-types.model';
import { Fact, FactCreate, Text, TextCreateUpdate } from '@/models/streetcode/text-contents.model';
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
    const [form] = useForm();
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
    const [subTitle, setSubTitle] = useState<Partial<Subtitle>>();
    const [figures, setFigures] = useState<RelatedFigureCreateUpdate[]>([]);
    const [arts, setArts] = useState<StreetcodeArtCreateUpdate[]>([]);
    const [arLink, setArLink] = useState<TransactionLink>();
    const [funcName, setFuncName] = useState<string>('create');
    const [visibleModal, setVisibleModal] = useState(false);
    const [savedChanges, setSavedChanges] = useState(true);
    const navigationString = 'Покинути сторінку? Внесені зміни, можливо, не буде збережено.';
    const [fieldChanges, setFieldChanges] = useState({});
    const streetcodeType = useRef<StreetcodeType>(StreetcodeType.Person);

    const handleFieldChange = (fieldName: any, value: any) => {
        setFieldChanges((prevChanges) => ({
            ...prevChanges,
            [fieldName]: value,
        }));
    };
    const [isPageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        if (isPageLoaded) {
            const isAnyFieldChanged = Object.values(fieldChanges).some((value) => value !== undefined && value !== '');
            setSavedChanges(!isAnyFieldChanged);
        } else {
            setPageLoaded(true);
        }
    }, [fieldChanges, isPageLoaded]);

    usePrompt(
        savedChanges
            ? { when: false, message: '' }
            : { when: true, message: navigationString },
    );
    const handleTabClosing = () => {
        console.log('Close tab');
    };

    const alertUser = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = navigationString;
    };

    useEffect(() => {
        if (!savedChanges) {
            window.addEventListener('beforeunload', alertUser);
            window.addEventListener('unload', handleTabClosing);
            return () => {
                window.removeEventListener('beforeunload', alertUser);
                window.removeEventListener('unload', handleTabClosing);
            };
        }
    });

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
                    modelState: ModelState.Updated,
                    isPersisted: true,
                }));
                setArts([...artToUpdate]);
            });
            StreetcodesApi.getById(parseId).then((x) => {
                streetcodeType.current = x.streetcodeType;
                form.setFieldsValue({
                    streetcodeNumber: x.index,
                    mainTitle: x.title,
                    name: x.firstName,
                    surname: x.lastName,
                    alias: x.alias,
                    streetcodeUrlName: x.transliterationUrl,
                    streetcodeFirstDate: dayjs(x.eventStartOrPersonBirthDate),
                    streetcodeSecondDate: x.eventEndOrPersonDeathDate ? dayjs(x.eventEndOrPersonDeathDate) : undefined,
                    dateString: x.dateString,
                    teaser: x.teaser,
                    video,
                });

                const tagsToUpdate: StreetcodeTagUpdate[] = x.tags.map((tag) => ({
                    ...tag,
                    isPersisted: true,
                    modelState: ModelState.Updated,
                    streetcodeId: parseId,
                }));

                setSelectedTags(tagsToUpdate as StreetcodeTag[]);
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
            PartnersApi.getPartnersToUpdateByStreetcodeId(parseId).then((result) => {
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
                .catch((error) => { });
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
                        form.setFieldValue('arlink', res.url);
                    }
                });
            factsStore.fetchFactsByStreetcodeId(parseId);
            timelineItemStore.fetchTimelineItemsByStreetcodeId(parseId);
            statisticRecordStore.fetchStatisticRecordsByStreetcodeId(parseId);
        }
    }, []);

    const onFinish = async (data: any) => {
        handleCancelModalRemove();
        console.log(form.getFieldValue('streetcodeNumber'));
        let tempStatus = 1;
        const buttonName = data.target.innerText;
        if (buttonName) {
            if (buttonName.includes(draft)) {
                tempStatus = 0;
                setSavedChanges(true);
            }
        }
        form.validateFields().then(() => {
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

            const streetcode: StreetcodeCreate = {
                id: parseId,
                index: form.getFieldValue('streetcodeNumber'),
                title: form.getFieldValue('mainTitle'),
                alias: form.getFieldValue('alias'),
                transliterationUrl: form.getFieldValue('streetcodeUrlName'),
                arBlockURL: form.getFieldValue('arlink'),
                streetcodeType: streetcodeType.current,
                eventStartOrPersonBirthDate: new Date(form.getFieldValue('streetcodeFirstDate') - localOffset),
                eventEndOrPersonDeathDate: form.getFieldValue('streetcodeSecondDate')
                    ? new Date(form.getFieldValue('streetcodeSecondDate') - localOffset) : null,
                imagesIds: createUpdateMediaStore.getImageIds(),
                audioId: createUpdateMediaStore.audioId,
                tags: selectedTags.map((tag) => ({ ...tag, id: tag.id < 0 ? 0 : tag.id })),
                relatedFigures: figures,
                text: text.title && text.textContent ? text : null,
                timelineItems: timelineItemStore.getTimelineItemArrayToCreate,
                facts: JSON.parse(JSON.stringify(factsStore.getFactArray))
                    .map((fact: Fact) => ({ ...fact, id: 0 })),
                coordinates: JSON.parse(JSON.stringify(streetcodeCoordinatesStore.getStreetcodeCoordinateArray))
                    .map((coordinate: StreetcodeCoordinate) => ({ ...coordinate, id: 0 })),
                partners,
                teaser: form.getFieldValue('teaser'),
                viewCount: 0,
                dateString: form.getFieldValue('dateString'),
                streetcodeArts: arts.map((streetcodeArt) => ({
                    ...streetcodeArt,
                    art: {
                        ...streetcodeArt.art,
                        image: null,
                    },
                })),
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
                imagesDetails: createUpdateMediaStore.getImageDetails(),

            };
            if (streetcodeType.current === StreetcodeType.Person) {
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
                    .map((tag) => ({ ...tag, streetcodeId: parseId })),
                ...tagsStore.getTagToDeleteArray];

                const arUrl = form.getFieldValue('arlink');
                const arLinkUpdated: TransactionLink = {
                    id: arLink?.id ?? 0,
                    streetcodeId: parseId,
                    url: arLink?.url ?? '',
                    urlTitle: arLink?.urlTitle ?? '',
                };

                if (text.id !== 0 && !(text.title && text.textContent)) {
                    text.modelState = ModelState.Deleted;
                }

                const streetcodeUpdate: StreetcodeUpdate = {
                    id: parseId,
                    index: form.getFieldValue('streetcodeNumber'),
                    firstName: null,
                    lastName: null,
                    title: form.getFieldValue('mainTitle'),
                    alias: form.getFieldValue('alias'),
                    status: tempStatus,
                    transliterationUrl: form.getFieldValue('streetcodeUrlName'),
                    streetcodeType: streetcodeType.current,
                    eventStartOrPersonBirthDate: new Date(form.getFieldValue('streetcodeFirstDate') - localOffset),
                    eventEndOrPersonDeathDate: new Date(form.getFieldValue('streetcodeSecondDate') - localOffset),
                    teaser: form.getFieldValue('teaser'),
                    dateString: form.getFieldValue('dateString'),
                    videos: videosUpdate,
                    relatedFigures: relatedFiguresUpdate,
                    timelineItems: timelineItemStore.getTimelineItemArrayToUpdate,
                    facts: factsStore.getFactArrayToUpdate.map((item) => ({ ...item, streetcodeId: parseId })),
                    partners: partnersUpdate,
                    subtitles: subtitleUpdate,
                    text: text.modelState === ModelState.Deleted || (text.title && text.textContent) ? text : null,
                    streetcodeCategoryContents: sourceCreateUpdateStreetcode.getCategoryContentsArrayToUpdate
                        .map((content) => ({ ...content, streetcodeId: parseId })),
                    streetcodeArts: [...arts.map((streetcodeArt) => ({ ...streetcodeArt, streetcodeId: parseId })),
                        ...streetcodeArtStore.getStreetcodeArtsToDelete].map((streetcodeArt) => ({
                        ...streetcodeArt,
                        art: {
                            ...streetcodeArt.art,
                            image: null,
                        },
                    })),
                    tags: tags.map((tag) => ({ ...tag, id: tag.id < 0 ? 0 : tag.id })),
                    statisticRecords: statisticRecordStore.getStatisticRecordArrayToUpdate
                        .map((record) => ({ ...record, streetcodeId: parseId })),
                    toponyms: newStreetcodeInfoStore.selectedToponyms,
                    images: createUpdateMediaStore.imagesUpdate.map((img):ImageCreateUpdate => ({ id: img.id, modelState: img.modelState, streetcodeId: img.streetcodeId })),
                    audios: createUpdateMediaStore.audioUpdate,
                    arLink: {
                        id: arLink?.id ?? 0,
                        streetcodeId: parseId,
                        url: form.getFieldValue('arlink') ?? '',
                        urlTitle: arLink?.urlTitle ?? '',
                    },
                    imagesDetails: (Array.from(factsStore.factImageDetailsMap.values()) as ImageDetails []).concat(createUpdateMediaStore.getImageDetailsUpdate()),
                };

                if (streetcodeType.current === StreetcodeType.Person) {
                    streetcodeUpdate.firstName = form.getFieldValue('name');
                    streetcodeUpdate.lastName = form.getFieldValue('surname');
                }
                console.log(streetcodeUpdate);
                StreetcodesApi.update(streetcodeUpdate).then(() => {
                    window.location.reload();
                }).then(() => {
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
        }).catch(() => {
            const name = form.getFieldsError().find((e) => e.errors.length > 0)?.name;
            if (name) {
                form.scrollToField(name, { block: 'center' });
            }
        });
    };
    const handleModalOk = (data: any) => {
        setSavedChanges(true);
        onFinish(data);
    };

    return (
        <div className="NewStreetcodeContainer">
            <PageBar />
            <ConfigProvider locale={ukUA}>
                <div className="adminContainer">
                    <div className="adminContainer-block">
                        <h2>Стріткод</h2>
                        <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError>
                            <MainBlockAdmin
                                Id={parseId}
                                form={form}
                                selectedTags={selectedTags}
                                setSelectedTags={setSelectedTags}
                                streetcodeType={streetcodeType}
                                onChange={handleFieldChange}
                            />
                            <TextBlock
                                inputInfo={inputInfo}
                                setInputInfo={setInputInfo}
                                video={video}
                                setVideo={setVideo}
                                onChange={handleFieldChange}
                            />
                            <InterestingFactsBlock onChange={handleFieldChange} />
                            <TimelineBlockAdmin onChange={handleFieldChange} />

                            
                            <MapBlockAdmin />
                            <ArtGalleryBlock arts={arts} setArts={setArts} onChange={handleFieldChange} />
                            <RelatedFiguresBlock currentStreetcodeId={parseId} figures={figures} setFigures={setFigures} onChange={handleFieldChange} />
                            <ForFansBlock onChange={handleFieldChange} />
                            <PartnerBlockAdmin partners={partners} setPartners={setPartners} onChange={handleFieldChange} />
                            <SubtitleBlock subTitle={subTitle} setSubTitle={setSubTitle} onChange={handleFieldChange} />
                            <ARBlock onChange={handleFieldChange} />
                        </Form>
                    </div>
                    <Button
                        className="streetcode-custom-button submit-button"
                        onClick={onFinish}
                        name={draft}
                        htmlType="submit"
                    >
                        {draft}
                    </Button>
                    <Modal
                        title="Ви впевнені, що хочете опублікувати цей стріткод?"
                        open={visibleModal}
                        onOk={handleModalOk}
                        onCancel={handleCancelModalRemove}
                    />
                    <Button
                        htmlType="submit"
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
