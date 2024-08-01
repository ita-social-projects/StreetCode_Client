/* eslint-disable react/jsx-no-bind,@typescript-eslint/no-use-before-define */
import "./ArtGalleryBlock.styles.scss";

import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Settings as SliderSettings } from "react-slick";
import SLIDER_PROPS from "@components/ArtGallery/constants/sliderProps";
import convertSlidesToTemplates from "@components/ArtGallery/utils/convertSlidesToTemplates";
import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import { ArtCreateUpdate } from "@models/media/art.model";
import StreetcodeArtSlide from "@models/media/streetcode-art-slide.model";
import useMobx, { useStreetcodeDataContext } from "@stores/root-store";
import BlockHeading from "@streetcode/HeadingBlock/BlockHeading.component";
import ArtGalleryTemplatesModal from "../modals/ArtGalleryTemplates/ArtGalleryTemplatesModal.component";
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

import { Button } from "antd";
import { useMediaQuery } from "react-responsive";

const MAX_SLIDES_AMOUNT = 30;

type Props = {
  isConfigurationGallery?: boolean;
  isAdmin?: boolean;
  isFillArtsStore?: boolean;
  title?: string;
};

const ArtGallery = ({
  title = "Арт-галерея",
  isAdmin,
  isConfigurationGallery,
  isFillArtsStore,
}: Props) => {
  const { streetcodeArtSlideStore, artGalleryTemplateStore, artStore } =
    useMobx();
  const {
    streetcodeStore: {
      itChangedIdChange,
      itChangedId,
      trackChange,
      getStreetCodeId,
      errorStreetCodeId
    },
  } = useStreetcodeDataContext();
  const { fetchAllToDefaultTemplate, fetchAllArtSlidesByStreetcodeId, fetchNextArtSlidesByStreetcodeId, streetcodeArtSlides, amountOfSlides, setStartingSlideAndId } = streetcodeArtSlideStore;
  const { streetcodeArtSlides: templateArtSlides } = artGalleryTemplateStore;
  const [slickProps, setSlickProps] = useState<SliderSettings>(SLIDER_PROPS);
  const [isTemplateSelected, setIsTemplateSelected] = useState(title === "Шаблони");
  const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const secondRender = useRef(false);
  const windowsize = useWindowSize();
  const isMobile = useMediaQuery({
    query: "(max-width: 680px)",
  });
  const [fetchedData, setFetchedData] = useState<boolean>(false)
  const [visibleSlidesCount, setVisibleSlidesCount] = useState<number>(0)

  const { id } = useParams<any>();
  const parseId = id ? +id : errorStreetCodeId;

  useEffect(() => {
    if (isAdmin || isConfigurationGallery) {
      fetchData().then(() => {
        setFetchedData(true);
      }).then(() => {
        itChangedIdChange();
      });
    } else {
      trackChange();
      if (itChangedId) {
        fetchData().then(() => {
          setFetchedData(true);
        }).then(() => {
          itChangedIdChange();
        });
      }
    }
  });

  useEffect(() => {
    setVisibleSlidesCount(streetcodeArtSlideStore.getVisibleSortedSlides(getStreetCodeId !== -1 ? getStreetCodeId : parseId).length)
  }, [fetchedData])

  async function fetchData() {
    if (streetcodeIdValidAndFetchingRequired()) {
      secondRender.current = true;
      if (isFillArtsStore) {
        let currStreetcodeId = getStreetCodeId !== -1 ? getStreetCodeId : parseId;
        const startingSlide = await fetchAllToDefaultTemplate(currStreetcodeId);

        let currentSlide = startingSlide ?? 0;
        while (currentSlide < MAX_SLIDES_AMOUNT) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await fetchAllArtSlidesByStreetcodeId(currStreetcodeId, currentSlide);
            
            currentSlide += amountOfSlides;
          } catch (error: unknown) {
            currentSlide = MAX_SLIDES_AMOUNT;
          }
        }
        
        copyArtsFromSlidesToStore();
      } else {
        let currentSlide = 0;
        while (currentSlide < MAX_SLIDES_AMOUNT) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await fetchNextArtSlidesByStreetcodeId(getStreetCodeId !== -1 ? getStreetCodeId : parseId);
            
            currentSlide += amountOfSlides;
          } catch (error: unknown) {
            currentSlide = MAX_SLIDES_AMOUNT;
          }
        }
      }
      setStartingSlideAndId(getStreetCodeId);
    }
  }

  function streetcodeIdValidAndFetchingRequired() {
    return (
      (getStreetCodeId !== errorStreetCodeId ||
        parseId !== errorStreetCodeId) &&
      !secondRender.current &&
      !isConfigurationGallery
    );
  }

  function copyArtsFromSlidesToStore() {
    runInAction(() => {
      const mappedArts = streetcodeArtSlides.map((slide) =>
        slide.streetcodeArts.map((sArt) => sArt.art)
      );

      artStore.arts = ([] as ArtCreateUpdate[]).concat(...mappedArts);
      artStore.toggleMutation();
    });
  }

  useEffect(() => {
    if (isConfigurationGallery) {
      toggleBlockingOfConfigurationSlider();
     
    }
  }, [artGalleryTemplateStore.isEdited, artGalleryTemplateStore.isRedact]);

  useEffect(() => {
    if (isConfigurationGallery || artGalleryTemplateStore.isRedact) {
      streetcodeArtSlideStore.isArtInSlideByRedact = false;
    streetcodeArtSlideStore.isArtInSlideByRedact = true;
    }
  });

  function toggleBlockingOfConfigurationSlider() {
    setSlickProps((prev) => ({
      ...prev,
      dots: !prev.dots,
      arrows: !prev.arrows,
      draggable: !prev.draggable,
    }));
  }

  function handleAddNewSlide() {
    const newSlide = artGalleryTemplateStore.getEditedSlide() as StreetcodeArtSlide;

    if (!newSlide) {
      alert('Увага, заповніть усі зображення щоб зберегти слайд');
      return;
    }

    if (artGalleryTemplateStore.isRedact) {
      runInAction(() => {
        const oldSlideIdx = streetcodeArtSlides.findIndex((s) => s.index === newSlide.index);
        if (oldSlideIdx !== -1) {
          streetcodeArtSlides[oldSlideIdx] = newSlide;
        }
      });
      runInAction(() => {
        artGalleryTemplateStore.isRedact = false;
        artGalleryTemplateStore.currentTemplateIndexRedact = -1;
      })
    } else {
      newSlide.index = streetcodeArtSlides.length;
      newSlide.streetcodeId = parseId ?? -1;

      runInAction(() => {
        streetcodeArtSlides.push(newSlide);
        streetcodeArtSlides.forEach((artSlide, index) => {
          artSlide.index = index + 1;
        })
      });
      streetcodeArtSlideStore.isArtInSlideByRedact = false;
    streetcodeArtSlideStore.isArtInSlideByRedact = true;
    }
    setSelectedTemplateIndex(0);
  }


  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsTemplateSelected(true);
  };
  const handleTemplateSelect = (templateIndex: number) => {
    setSelectedTemplateIndex(templateIndex);
    runInAction(() => {
      artGalleryTemplateStore.isRedact = false;
      artGalleryTemplateStore.currentTemplateIndexRedact = -1;
    })
    if (templateIndex !== selectedTemplateIndex) {
      artGalleryTemplateStore.clearTemplates();
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  function handleClearSlideTemplate() {
    artGalleryTemplateStore.clearTemplates();
    if (artGalleryTemplateStore.isRedact) {
      runInAction(() => {
        artGalleryTemplateStore.isRedact = false;
        artGalleryTemplateStore.currentTemplateIndexRedact = -1;
      })
    }
    setIsTemplateSelected(title === "Шаблони");
    setSelectedTemplateIndex(0);
  }
  const sliderProps = {
    className: 'artGallerySliderContainer',
    infinite: false,
    arrows: true,
    dots: true,
    draggable: true,
    touchThreshold: 25,
    slidesToScroll: 1,
    slidesToShow: 1,
    centerPadding: '0px',
  };

  return (
    <div>
      {(((streetcodeArtSlides.length > 0 && (isAdmin || visibleSlidesCount > 0)) || isConfigurationGallery)) && (
        <div id={isConfigurationGallery?"config-art-gallery":"art-gallery"} className="artGalleryWrapper">
          <div className="artGalleryContainer container">
            <BlockHeading headingText={title} />
            {title === "Шаблони" && (
              <div className="container-for-arts-block">
                <Button
                  className="art-custom-button"
                  onClick={handleOpenModal}
                >
                  Обрати шаблон
                </Button>
              </div>
            )}
            <ArtGalleryTemplatesModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onTemplateSelect={handleTemplateSelect}
            />

            <div className="artGalleryContentContainer">
              <div  className={isAdmin && (windowsize.width > 1025 && windowsize.width <1450)? "artGallerySliderContainer2" : "artGallerySliderContainer"}>
                {isMobile ? (
                  <SlickSlider {...sliderProps}>
                    {isTemplateSelected && !artGalleryTemplateStore.isRedact ? (
                      convertSlidesToTemplates(
                        [templateArtSlides[selectedTemplateIndex]] as StreetcodeArtSlide[],
                        true,
                        false,
                        true,
                      )
                    ) : (
                      isConfigurationGallery ? (
                        convertSlidesToTemplates(
                          templateArtSlides as StreetcodeArtSlide[],
                          true,
                          false,
                          true,
                        )
                      ) : (
                        convertSlidesToTemplates(
                          streetcodeArtSlideStore.getVisibleSortedSlides(getStreetCodeId !== -1 ? getStreetCodeId : parseId) as StreetcodeArtSlide[],
                          false,
                          isAdmin
                        )
                      )
                    )}
                  </SlickSlider>
                )
                  : (
                    <SlickSlider {...slickProps}>
                      {isTemplateSelected && !artGalleryTemplateStore.isRedact ? (
                        convertSlidesToTemplates(
                          [templateArtSlides[selectedTemplateIndex]] as StreetcodeArtSlide[],
                          true,
                          false,
                          true,
                        )
                      ) : (
                        isConfigurationGallery ? (
                          convertSlidesToTemplates(
                            templateArtSlides as StreetcodeArtSlide[],
                            true,
                            false,
                            true,
                          )
                        ) : (
                          convertSlidesToTemplates(
                            streetcodeArtSlideStore.getVisibleSortedSlides(getStreetCodeId !== -1 ? getStreetCodeId : parseId) as StreetcodeArtSlide[],
                            false,
                            isAdmin
                          )
                        )
                      )}
                    </SlickSlider>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
      {(artGalleryTemplateStore.isEdited || artGalleryTemplateStore.isRedact) && isConfigurationGallery ? (
        <div className="configurationGalleryControls">
          <Button type="primary" onClick={handleAddNewSlide}>
            Додати
          </Button>
          <Button danger onClick={handleClearSlideTemplate}>
            Скасувати
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default observer(ArtGallery);
