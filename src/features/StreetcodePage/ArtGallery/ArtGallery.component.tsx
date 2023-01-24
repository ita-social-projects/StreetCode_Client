import "./ArtGallery.styles.scss";

import Rectangle106 from "@images/art-gallery/Rectangle106.png";
import Rectangle107 from "@images/art-gallery/Rectangle107.png";
import Rectangle108 from "@images/art-gallery/Rectangle108.png";
import Rectangle111 from "@images/art-gallery/Rectangle111.png";
import Rectangle109 from "@images/art-gallery/Rectangle109.png";
import Rectangle110 from "@images/art-gallery/Rectangle110.png";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { getImageSize } from "react-image-size";
import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import useMobx from "@stores/root-store";
import BlockHeading from "@streetcode/HeadingBlock/BlockHeading.component";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import { useRouteId } from "@/app/common/hooks/stateful/useRouter.hook";
import ArtGalleryListOfItem from "./ArtGalleryListOfItem/ArtGalleryListOfItem.component";

type IndexedArt = {
  index: number;
  description: string;
  imageHref: string;
  offset: number;
  title: string;
};

const SECTION_AMOUNT = 6;

const ArtGallery = () => {
  const { streetcodeArtStore } = useMobx();
  const { fetchStreetcodeArtsByStreetcodeId, getStreetcodeArtArray } =
    streetcodeArtStore;

  const streetcodeId = useRouteId();
  const [indexedArts, setIndexedArts] = useState<IndexedArt[]>([]);

  useAsync(
    () => fetchStreetcodeArtsByStreetcodeId(streetcodeId),
    [streetcodeId]
  );
  function getOffset(width: number, height: number) {
    if (width <= height) {
      return 2;
    } else if (width > height && height <= 300) {
      return 1;
    } else {
      return 4;
    }
  }
  useEffect(() => {
    const newMap: IndexedArt[] = [];

    getStreetcodeArtArray?.forEach(
      async ({ art: { description, image }, index }) => {
        try {
          const { width, height } = await getImageSize(image.url.href);

          newMap.push({
            index,
            description,
            imageHref: image.url.href,
            title: image.url.title,
            offset: getOffset(width, height),
          } as IndexedArt);
        } catch (error: unknown) {
          console.log(`Error: cannot parse the image url: ${image.url.href}`);
        }
        setIndexedArts(newMap);
      }
    );
  }, [getStreetcodeArtArray]);

  const sortedArtsList = [...indexedArts].sort((a, b) => a.index - b.index);

  let offsetSumForSlide = 0;
  let offsetSum = 0;

  const slideOfArtList = [];
  let artsData: IndexedArt[] = [];

  slideOfArtList.push(
    <ArtGalleryListOfItem
      images={[Rectangle106, Rectangle107, Rectangle108]}
      descriptions={[]}
      titles={[]}
      offset={[1, 1, 2]}
    />
  );

  slideOfArtList.push(
    <ArtGalleryListOfItem
      images={[Rectangle106, Rectangle107]}
      descriptions={[]}
      titles={[]}
      offset={[1, 1]}
    />
  );

  slideOfArtList.push(
    <ArtGalleryListOfItem
      images={[Rectangle108]}
      descriptions={[]}
      titles={[]}
      offset={[2]}
    />
  );

  slideOfArtList.push(
    <ArtGalleryListOfItem
      images={[Rectangle111]}
      descriptions={[]}
      titles={[]}
      offset={[4]}
    />
  );

  slideOfArtList.push(
    <ArtGalleryListOfItem
      images={[
        Rectangle106,
        Rectangle107,
        Rectangle107,
        Rectangle107,
        Rectangle109,
        Rectangle109,
      ]}
      descriptions={[]}
      titles={[]}
      offset={[1, 1, 1, 1, 1, 1]}
    />
  );

  slideOfArtList.push(
    <ArtGalleryListOfItem
      images={[
        Rectangle108,
        Rectangle107,
        Rectangle109,
        Rectangle106,
        Rectangle109,
      ]}
      descriptions={[]}
      titles={[]}
      offset={[1, 1, 2, 1, 1]}
    />
  );

  slideOfArtList.push(
    <ArtGalleryListOfItem
      images={[Rectangle108, Rectangle108, Rectangle108]}
      descriptions={[]}
      titles={[]}
      offset={[2, 2, 2]}
    />
  );

  sortedArtsList.forEach(({ index, offset, imageHref, description, title }) => {
    if (offsetSumForSlide != SECTION_AMOUNT) {
      offsetSumForSlide += offset ?? 0;
      offsetSum += offset ?? 0;
      artsData.push({
        index,
        imageHref,
        description,
        offset,
        title,
      } as IndexedArt);
    }
    if (offsetSumForSlide == SECTION_AMOUNT) {
      offsetSumForSlide = 0;
      slideOfArtList.push(
        <ArtGalleryListOfItem
          images={artsData.map((i) => i.imageHref)}
          descriptions={artsData.map((i) => i.description)}
          titles={artsData.map((i) => i.title)}
          offset={artsData.map((i) => i.offset)}
        />
      );
      artsData = [];
    }
  });

  if (!Number.isInteger(offsetSum / SECTION_AMOUNT)) {
    slideOfArtList.push(
      <ArtGalleryListOfItem
        images={artsData.map((i) => i.imageHref)}
        descriptions={artsData.map((i) => i.description)}
        titles={artsData.map((i) => i.title)}
        offset={artsData.map((i) => i.offset)}
      />
    );
  }

  return (
    <div className="artGalleryWrapper">
      <div className="artGalleryContainer">
        <BlockHeading headingText="Арт-галерея" />
        <div className="artGalleryContentContainer">
          <div className="artGallerySliderContainer">
            <SlickSlider
              infinite={false}
              swipe={false}
              dots
              rows={1}
              slidesToShow={1}
              slides={slideOfArtList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ArtGallery);
