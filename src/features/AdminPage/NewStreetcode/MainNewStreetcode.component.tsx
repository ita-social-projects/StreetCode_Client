/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import "./MainNewStreetcode.styles.scss";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    unstable_usePrompt as usePrompt,
    useNavigate,
    useParams,
} from "react-router-dom";
import SubtitlesApi from "@app/api/additional-content/subtitles.api";
import VideosApi from "@app/api/media/videos.api";
import PartnersApi from "@app/api/partners/partners.api";
import SourcesApi from "@app/api/sources/sources.api";
import RelatedFigureApi from "@app/api/streetcode/related-figure.api";
import TextsApi from "@app/api/streetcode/text-content/texts.api";
import useMobx from "@app/stores/root-store";
import ArtGallery from "@components/ArtGallery/ArtGalleryBlock.component";
import ArtGalleryDndContext from "@components/ArtGallery/context/ArtGalleryDndContext";
import StreetcodeArtsBlock from "@features/AdminPage/NewStreetcode/StreetcodeArtsBlock/StreetcodeArtsBlock.component";
import PageBar from "@features/AdminPage/PageBar/PageBar.component";
import StreetcodeCoordinate from "@models/additional-content/coordinate.model";
import { ModelState } from "@models/enums/model-state";
import {
    RelatedFigureCreateUpdate,
    RelatedFigureUpdate,
} from "@models/streetcode/related-figure.model";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(tz);

import { Button, ConfigProvider, Form, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import ukUA from "antd/locale/uk_UA";

import StreetcodesApi from "@/app/api/streetcode/streetcodes.api";
import TransactionLinksApi from "@/app/api/transactions/transactLinks.api";
import FRONTEND_ROUTES from "@/app/common/constants/frontend-routes.constants";
import { removeHtmlTags } from "@/app/common/utils/removeHtmlTags.utility";
import QUILL_TEXTS_LENGTH from "@/features/AdminPage/NewStreetcode/TextBlock/TextLengthConstants/textMaxLength.constant";
import Subtitle, {
    SubtitleCreate,
} from "@/models/additional-content/subtitles.model";
import {
    StreetcodeTag,
    StreetcodeTagUpdate,
} from "@/models/additional-content/tag.model";
import StatisticRecord from "@/models/analytics/statisticrecord.model";
import { AudioUpdate } from "@/models/media/audio.model";
import { ImageCreateUpdate, ImageDetails } from "@/models/media/image.model";
import Video, { VideoCreate } from "@/models/media/video.model";
import {
    PartnerCreateUpdateShort,
    PartnerUpdate,
} from "@/models/partners/partners.model";
import {
    StreetcodeCategoryContent,
    StreetcodeCategoryContentUpdate,
} from "@/models/sources/sources.model";
import {
    StreetcodeCreate,
    StreetcodeType,
    StreetcodeUpdate,
} from "@/models/streetcode/streetcode-types.model";
import {
    Fact,
    Text,
    TextCreateUpdate,
} from "@/models/streetcode/text-contents.model";
import {
    TransactionLink,
    TransactionLinkUpdate,
} from "@/models/transactions/transaction-link.model";

import ARBlock from "./ARBlock/ARBlock.component";
import CategoriesBlock from "./CategoriesBlock/CategoriesBlock.component";
import RelatedFiguresBlock from "./HistoryRelations/HistoryRelations.component";
import InterestingFactsBlock from "./InterestingFactsBlock/InterestingFactsBlock.component";
import MainBlockAdmin from "./MainBlock/MainBlockAdmin.component";
import PartnerBlockAdmin from "./PartnerBlock/PartnerBlockAdmin.components";
import SubtitleBlock from "./SubtitileBlock/SubtitleBlock.component";
import TextBlock from "./TextBlock/TextBlock.component";
import TimelineBlockAdmin from "./TimelineBlock/TimelineBlockAdmin.component";

function reindex<T extends { index?: number }>(list: T[]): T[] {
    const result = Array.from(list);

    for (let i = 0; i < result.length; i += 1) {
        result[i].index = i;
    }

    return result;
}

const NewStreetcode = () => {
    const publish = "Опублікувати";
    const draft = "Зберегти як чернетку";
    const [form] = useForm();
    const {
        factsStore,
        timelineItemStore,
        newStreetcodeInfoStore,
        sourceCreateUpdateStreetcode,
        streetcodeCoordinatesStore,
        createUpdateMediaStore,
        statisticRecordStore,
        artStore,
        tagsStore,
        streetcodeArtSlideStore,
    } = useMobx();

    const [partners, setPartners] = useState<PartnerCreateUpdateShort[]>([]);
    const [selectedTags, setSelectedTags] = useState<StreetcodeTag[]>([]);
    const [inputInfo, setInputInfo] = useState<Partial<Text>>();
    const [video, setVideo] = useState<Video>();
    const [subTitle, setSubTitle] = useState<Partial<Subtitle>>();
    const [figures, setFigures] = useState<RelatedFigureCreateUpdate[]>([]);
    const [arLink, setArLink] = useState<TransactionLink>();
    const [funcName, setFuncName] = useState<string>("create");
    const [visibleModal, setVisibleModal] = useState(false);
    const [savedChanges, setSavedChanges] = useState(true);
    const navigationString =
        "Покинути сторінку? Внесені зміни, можливо, не буде збережено.";
    const [fieldChanges, setFieldChanges] = useState({});
    const streetcodeType = useRef<StreetcodeType>(StreetcodeType.Person);
    const [allPersistedSourcesAreSet, setAllPersistedSourcesAreSet] =
        useState(false);

    const handleFieldChange = (fieldName: any, value: any) => {
        setFieldChanges((prevChanges) => ({
            ...prevChanges,
            [fieldName]: value,
        }));
    };
    const [isPageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        if (isPageLoaded) {
            const isAnyFieldChanged = Object.values(fieldChanges).some(
                (value) => value !== undefined && value !== ""
            );
            setSavedChanges(!isAnyFieldChanged);
        } else {
            setPageLoaded(true);
        }
    }, [fieldChanges, isPageLoaded]);

    usePrompt(
        savedChanges
            ? { when: false, message: "" }
            : { when: true, message: navigationString }
    );

    const alertUser = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = navigationString;
    };

    const validateQuillTexts = (
        mainText: string | undefined,
        additionalText: string | undefined
    ) => {
        const mainTextWithoutHtml = mainText ? removeHtmlTags(mainText) : "";
        const additionalTextWithoutHtml = additionalText
            ? removeHtmlTags(additionalText)
            : "";

        const tooLongMainText =
            mainText &&
            mainTextWithoutHtml.length > QUILL_TEXTS_LENGTH.mainTextMaxLength;
        const tooLongAdditionalText =
            additionalText &&
            additionalTextWithoutHtml.length >
                QUILL_TEXTS_LENGTH.additionalTextMaxLength;

        if (tooLongMainText || tooLongAdditionalText) {
            throw new Error(
                "The value is too long either in the main text or in the additional text"
            );
        }
    };

    useEffect(() => {
        if (!savedChanges) {
            window.addEventListener("beforeunload", alertUser);
            return () => {
                window.removeEventListener("beforeunload", alertUser);
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
            ukUA.DatePicker.lang.locale = "uk";
        }

        if (parseId) {
            TextsApi.getByStreetcodeId(parseId).then((result) => {
                setInputInfo(result);
                StreetcodesApi.getById(parseId).then((x) => {
                    streetcodeType.current = x.streetcodeType;
                    form.setFieldsValue({
                        streetcodeNumber: x.index,
                        mainTitle: x.title,
                        name: x.firstName,
                        surname: x.lastName,
                        alias: x.alias,
                        streetcodeUrlName: x.transliterationUrl,
                        streetcodeFirstDate: dayjs
                            .utc(x.eventStartOrPersonBirthDate)
                            .local(),
                        streetcodeSecondDate: x.eventEndOrPersonDeathDate
                            ? dayjs.utc(x.eventEndOrPersonDeathDate).local()
                            : undefined,
                        dateString: x.dateString,
                        teaser: x.teaser,
                    });

                    const tagsToUpdate: StreetcodeTagUpdate[] = x.tags.map(
                        (tag) => ({
                            ...tag,
                            isPersisted: true,
                            modelState: ModelState.Updated,
                            streetcodeId: parseId,
                        })
                    );

                    setSelectedTags(tagsToUpdate as StreetcodeTag[]);
                    setFuncName("update");
                });

                VideosApi.getByStreetcodeId(parseId).then((result) => {
                    setVideo(result);
                    setInputInfo((prevState) => ({
                        ...prevState,
                        ["link"]: result.url,
                    }));
                });
                RelatedFigureApi.getByStreetcodeId(parseId).then((result) => {
                    const persistedFigures: RelatedFigureCreateUpdate[] =
                        result.map((item) => ({
                            id: item.id,
                            title: item.title,
                            isPersisted: true,
                            modelState: ModelState.Updated,
                        }));

                    setFigures(persistedFigures);
                });
                PartnersApi.getPartnersToUpdateByStreetcodeId(parseId).then(
                    (result) => {
                        const persistedPartners: PartnerCreateUpdateShort[] =
                            result.map((item) => ({
                                id: item.id,
                                title: item.title,
                                isPersisted: true,
                                modelState: ModelState.Updated,
                            }));

                        setPartners(persistedPartners);
                    }
                );
                SubtitlesApi.getSubtitlesByStreetcodeId(parseId)
                    .then((resultSubtitle) => {
                        if (resultSubtitle) {
                            setSubTitle(resultSubtitle);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                SourcesApi.getCategoriesByStreetcodeId(parseId).then(
                    (result) => {
                        const id = result.map((x) => x.id);
                        const getAllStreetcodeCategoriesContentRequest =
                            result.map((x) =>
                                SourcesApi.getCategoryContentByStreetcodeId(
                                    parseId,
                                    x.id
                                )
                            );
                        Promise.all(getAllStreetcodeCategoriesContentRequest)
                            .then((x) => {
                                const newSources: StreetcodeCategoryContent[] =
                                    x.map((e) => ({
                                        sourceLinkCategoryId:
                                            e.sourceLinkCategoryId,
                                        streetcodeId: e.streetcodeId,
                                        id: e.id,
                                        text: e.text,
                                    }));
                                newSources.map((newSource) => {
                                    const existingSource =
                                        sourceCreateUpdateStreetcode.streetcodeCategoryContents.find(
                                            (s) =>
                                                s.sourceLinkCategoryId ===
                                                newSource.sourceLinkCategoryId
                                        );

                                    if (!existingSource) {
                                        const persistedItem: StreetcodeCategoryContentUpdate =
                                            {
                                                ...newSource,
                                                isPersisted: true,
                                                modelState: ModelState.Updated,
                                            };

                                        sourceCreateUpdateStreetcode.setItem(
                                            persistedItem
                                        );
                                    }
                                });
                            })
                            .then(() => {
                                setAllPersistedSourcesAreSet(true);
                            });
                    }
                );
                TransactionLinksApi.getByStreetcodeId(parseId).then((res) => {
                    if (res) {
                        setArLink(res);
                        form.setFieldValue("arlink", res.url);
                    }
                });
            });

            factsStore.fetchFactsByStreetcodeId(parseId);
            timelineItemStore.fetchTimelineItemsByStreetcodeId(parseId);
            statisticRecordStore.fetchStatisticRecordsByStreetcodeId(parseId);
        } else {
            setAllPersistedSourcesAreSet(true);
        }
    }, []);

    const scrollToErrors = () => {
        const errors = form.getFieldsError();
        const firstErrorIndex = errors.findIndex((e) => e.errors.length > 0);
        if (firstErrorIndex !== -1) {
            const firstErrorName = String(errors[firstErrorIndex].name);
            if (
                firstErrorName === "animations" ||
                firstErrorName === "pictureBlackWhite"
            ) {
                const containerElement = document.querySelector(
                    ".scrollable-container"
                );
                if (containerElement) {
                    containerElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            } else {
                form.scrollToField(firstErrorName, { block: "center" });
            }
        }
    };

    const onFinish = async (data: any) => {
        handleCancelModalRemove();
        let tempStatus = 1;
        const buttonName = data.target.innerText;
        if (buttonName) {
            if (buttonName.includes(draft)) {
                tempStatus = 0;
                setSavedChanges(true);
            }
        }
        form.validateFields()
            .then(() => {
                data.stopPropagation();

                let subtitles: SubtitleCreate[] = [];
                if (subTitle != null && subTitle.subtitleText) {
                    subtitles = [{ subtitleText: subTitle!.subtitleText }];
                }
                let videos: VideoCreate[] = [];
                if (inputInfo != null && inputInfo.link) {
                    videos = [{ url: inputInfo.link }];
                }

                const text: TextCreateUpdate = {
                    id: inputInfo?.id ?? 0,
                    title: inputInfo?.title,
                    textContent: inputInfo?.textContent ?? " ",
                    additionalText:
                        inputInfo?.textContent !== "<p><br></p>"
                            ? inputInfo?.additionalText ===
                              "<p>Текст підготовлений спільно з</p>"
                                ? ""
                                : inputInfo?.additionalText
                            : "",
                    streetcodeId: parseId,
                };
                validateQuillTexts(text.textContent, text.additionalText);

                const streetcode: StreetcodeCreate = {
                    id: parseId,
                    index: form.getFieldValue("streetcodeNumber"),
                    title: form.getFieldValue("mainTitle"),
                    alias: form.getFieldValue("alias"),
                    transliterationUrl: form.getFieldValue("streetcodeUrlName"),
                    arBlockURL: form.getFieldValue("arlink"),
                    streetcodeType: streetcodeType.current,
                    eventStartOrPersonBirthDate: dayjs
                        .utc(form.getFieldValue("streetcodeFirstDate"))
                        .toDate(),
                    eventEndOrPersonDeathDate: form.getFieldValue(
                        "streetcodeSecondDate"
                    )
                        ? dayjs
                              .utc(form.getFieldValue("streetcodeSecondDate"))
                              .toDate()
                        : null,
                    imagesIds: createUpdateMediaStore.getImageIds(),
                    audioId: createUpdateMediaStore.audioId,
                    tags: reindex(selectedTags).map((tag) => ({
                        ...tag,
                        id: tag.id < 0 ? 0 : tag.id,
                    })),
                    relatedFigures: figures,
                    text: text.title && text.textContent ? text : null,
                    timelineItems:
                        timelineItemStore.getTimelineItemArrayToCreate,
                    facts: reindex(
                        JSON.parse(JSON.stringify(factsStore.getFactArray)).map(
                            (fact: Fact) => ({ ...fact, id: 0 })
                        )
                    ),
                    coordinates: JSON.parse(
                        JSON.stringify(
                            streetcodeCoordinatesStore.getStreetcodeCoordinateArray
                        )
                    ).map((coordinate: StreetcodeCoordinate) => ({
                        ...coordinate,
                        id: 0,
                    })),
                    partners,
                    teaser: form.getFieldValue("teaser"),
                    viewCount: 0,
                    dateString: form.getFieldValue("dateString"),
                    arts: artStore.arts,
                    streetcodeArtSlides:
                        streetcodeArtSlideStore.getArtSlidesAsDTO(),
                    subtitles,
                    firstName: null,
                    lastName: null,
                    videos,
                    status: tempStatus,
                    toponyms: newStreetcodeInfoStore.selectedToponyms,
                    streetcodeCategoryContents: JSON.parse(
                        JSON.stringify(
                            sourceCreateUpdateStreetcode.streetcodeCategoryContents
                        )
                    ).map(
                        (
                            streetcodeCategoryContent: StreetcodeCategoryContent
                        ) => ({
                            ...streetcodeCategoryContent,
                            id: 0,
                        })
                    ),
                    statisticRecords: JSON.parse(
                        JSON.stringify(
                            statisticRecordStore.getStatisticRecordArray
                        )
                    ).map((statisticRecord: StatisticRecord) => ({
                        ...statisticRecord,
                        id: 0,
                        coordinateId: 0,
                        streetcodeCoordinate: {
                            ...statisticRecord.streetcodeCoordinate,
                            id: 0,
                        },
                    })),
                    imagesDetails: createUpdateMediaStore.getImageDetails(),
                };

                if (streetcodeType.current === StreetcodeType.Person) {
                    streetcode.firstName = form.getFieldValue("name");
                    streetcode.lastName = form.getFieldValue("surname");
                }
                if (parseId) {
                    const relatedFiguresUpdate: RelatedFigureUpdate[] =
                        figures.map((figure) => ({
                            observerId: parseId,
                            targetId: figure.id,
                            modelState: figure.modelState,
                        }));

                    const partnersUpdate: PartnerUpdate[] = partners.map(
                        (partner) => ({
                            streetcodeId: parseId,
                            partnerId: partner.id,
                            modelState: partner.modelState,
                        })
                    );

                    let videosUpdate: Video[] = [];
                    if (inputInfo != null && inputInfo.link) {
                        videosUpdate = [
                            { ...video, url: inputInfo.link } as Video,
                        ];
                    }
                    let subtitleUpdate: Subtitle[] = [];
                    if (subTitle != null && subTitle.subtitleText) {
                        subtitleUpdate = [
                            {
                                ...subTitle,
                                subtitleText: subTitle!.subtitleText,
                            } as Subtitle,
                        ];
                    }

                    const tags = [
                        ...(reindex(selectedTags) as StreetcodeTagUpdate[]).map(
                            (tag) => ({
                                ...tag,
                                streetcodeId: parseId,
                            })
                        ),
                        ...tagsStore.getTagToDeleteArray,
                    ];

                    const arUrl = form.getFieldValue("arlink");
                    let arLinkUpdated: TransactionLinkUpdate | null = {
                        id: arLink?.id ?? 0,
                        streetcodeId: parseId,
                        url: arLink?.url ?? "",
                        urlTitle: arLink?.urlTitle ?? "",
                        qrCodeUrl: arLink?.urlTitle ?? "",
                    };
                    if (arUrl) {
                        arLinkUpdated = {
                            ...arLinkUpdated,
                            url: arUrl,
                            modelState: ModelState.Updated,
                        };
                    } else {
                        arLinkUpdated = null;
                    }

                    if (text.id !== 0 && !text.title) {
                        text.modelState = ModelState.Deleted;
                    }

                    const streetcodeUpdate: StreetcodeUpdate = {
                        id: parseId,
                        index: form.getFieldValue("streetcodeNumber"),
                        firstName: null,
                        lastName: null,
                        title: form.getFieldValue("mainTitle"),
                        alias: form.getFieldValue("alias"),
                        status: tempStatus,
                        transliterationUrl:
                            form.getFieldValue("streetcodeUrlName"),
                        streetcodeType: streetcodeType.current,
                        eventStartOrPersonBirthDate: dayjs
                            .utc(form.getFieldValue("streetcodeFirstDate"))
                            .toDate(),
                        eventEndOrPersonDeathDate: form.getFieldValue(
                            "streetcodeSecondDate"
                        )
                            ? dayjs
                                  .utc(
                                      form.getFieldValue("streetcodeSecondDate")
                                  )
                                  .toDate()
                            : null,
                        teaser: form.getFieldValue("teaser"),
                        dateString: form.getFieldValue("dateString"),
                        videos: videosUpdate,
                        relatedFigures: relatedFiguresUpdate,
                        timelineItems:
                            timelineItemStore.getTimelineItemArrayToUpdate,
                        facts: reindex(
                            factsStore.getFactArrayToUpdate.map((item) => ({
                                ...item,
                                streetcodeId: parseId,
                                id: item.id < 0 ? 0 : item.id,
                            }))
                        ),
                        partners: partnersUpdate,
                        subtitles: subtitleUpdate,
                        text:
                            text.modelState === ModelState.Deleted || text.title
                                ? text
                                : null,
                        streetcodeCategoryContents:
                            sourceCreateUpdateStreetcode.getCategoryContentsArrayToUpdate.map(
                                (content) => ({
                                    ...content,
                                    streetcodeId: parseId,
                                })
                            ),
                        arts: artStore.arts,
                        streetcodeArtSlides:
                            streetcodeArtSlideStore.getArtSlidesAsDTO(),
                        tags: tags.map((tag) => ({
                            ...tag,
                            id: tag.id < 0 ? 0 : tag.id,
                        })),
                        statisticRecords:
                            statisticRecordStore.getStatisticRecordArrayToUpdate.map(
                                (record) => ({
                                    ...record,
                                    streetcodeId: parseId,
                                })
                            ),
                        toponyms: newStreetcodeInfoStore.selectedToponyms,
                        images: createUpdateMediaStore.imagesUpdate.map(
                            (img): ImageCreateUpdate => ({
                                id: img.id,
                                modelState: img.modelState,
                                streetcodeId: img.streetcodeId,
                            })
                        ),
                        audioId: createUpdateMediaStore.audioId,
                        audios: createUpdateMediaStore.audioUpdate.map(
                            (a): AudioUpdate => ({
                                id: a.id,
                                modelState: a.modelState,
                                streetcodeId: a.streetcodeId,
                            })
                        ),
                        transactionLink: arLinkUpdated,
                        imagesDetails: (
                            Array.from(
                                factsStore.factImageDetailsMap.values()
                            ) as ImageDetails[]
                        ).concat(
                            createUpdateMediaStore.getImageDetailsUpdate()
                        ),
                    };

                    if (streetcodeType.current === StreetcodeType.Person) {
                        streetcodeUpdate.firstName = form.getFieldValue("name");
                        streetcodeUpdate.lastName =
                            form.getFieldValue("surname");
                    }
                    StreetcodesApi.update(streetcodeUpdate)
                        .then(() => {
                            window.location.reload();
                        })
                        .then(() => {
                            alert("Cтріткод успішно оновлений");
                        })
                        .catch((error) => {
                            alert("Виникла помилка при оновленні history-коду");
                            console.error(error);
                        });
                } else {
                    StreetcodesApi.create(streetcode)
                        .then(() => {
                            streetcodeArtSlideStore.streetcodeArtSlides = [];
                            if (tempStatus === 1) {
                                navigate(
                                    `../${form.getFieldValue(
                                        "streetcodeUrlName"
                                    )}`,
                                    {
                                        replace: true,
                                    }
                                );
                            } else {
                                navigate(
                                    `${
                                        FRONTEND_ROUTES.ADMIN.BASE
                                    }/${form.getFieldValue(
                                        "streetcodeUrlName"
                                    )}`
                                );
                            }
                        })
                        .catch((error) => {
                            alert("Виникла помилка при створенні history-коду");
                            console.error(error);
                        });
                }
            })
            .catch((error) => {
                const name = form
                    .getFieldsError()
                    .find((e) => e.errors.length > 0)?.name;
                if (name) {
                    scrollToErrors();
                } else {
                    alert("Будь ласка, заповніть всі поля валідними даними");
                    console.error(error);
                }
            });
    };
    const handleModalOk = (data: any) => {
        setSavedChanges(true);
        onFinish(data);
    };

    return (
        <div className="newStreetcodeContainer">
            <PageBar />
            <ConfigProvider locale={ukUA}>
                <div className="adminContainer">
                    <div className="adminContainer-block">
                        <h2>History-код</h2>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            scrollToFirstError
                        >
                            <MainBlockAdmin
                                Id={parseId}
                                form={form}
                                selectedTags={selectedTags}
                                setSelectedTags={setSelectedTags}
                                streetcodeType={streetcodeType}
                                onChange={handleFieldChange}
                            />
                            <TextBlock
                                parseId={parseId}
                                inputInfo={inputInfo}
                                form={form}
                                setInputInfo={setInputInfo}
                                video={video}
                                setVideo={setVideo}
                                onChange={handleFieldChange}
                            />
                            <InterestingFactsBlock
                                onChange={handleFieldChange}
                            />
                            <TimelineBlockAdmin onChange={handleFieldChange} />
                            <ArtGalleryDndContext>
                                <StreetcodeArtsBlock />
                                <ArtGallery
                                    isConfigurationGallery
                                    title="Шаблони"
                                />
                                <ArtGallery
                                    isAdmin
                                    title="Попередній перегляд"
                                />
                            </ArtGalleryDndContext>
                            <RelatedFiguresBlock
                                currentStreetcodeId={parseId}
                                figures={figures}
                                setFigures={setFigures}
                                onChange={handleFieldChange}
                            />
                            <CategoriesBlock
                                onChange={handleFieldChange}
                                allPersistedSourcesAreSet={
                                    allPersistedSourcesAreSet
                                }
                            />
                            <PartnerBlockAdmin
                                partners={partners}
                                setPartners={setPartners}
                                onChange={handleFieldChange}
                            />
                            <SubtitleBlock
                                subTitle={subTitle}
                                setSubTitle={setSubTitle}
                                onChange={handleFieldChange}
                            />
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
                        title="Ви впевнені, що хочете опублікувати цей history-код?"
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
