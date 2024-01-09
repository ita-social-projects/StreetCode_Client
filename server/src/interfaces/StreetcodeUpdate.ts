import Image from './Image';

export interface StreetcodeUpdate {
  id: number;
  transliterationUrl: string;
  title: string;
  images: Image[];

  teaser?: string;
  firstName?: string | null;
  lastName?: string | null;
  index?: number;
  alias?: string;
  status?: any;
  eventStartOrPersonBirthDate?: Date | null;
  eventEndOrPersonDeathDate?: Date | null;
  dateString?: string;
  streetcodeType?: any;
  videos?: any[];
  facts?: any[];
  relatedFigures?: any[];
  timelineItems?: any[];
  partners?: any[];
  streetcodeArts?: any[];
  subtitles?: any[];
  text?: any | null;
  streetcodeCategoryContents?: any[];
  tags?: any[];
  statisticRecords?: any[];
  toponyms?: any[];
  audioId?: number | null;
  audios?: any[];
  imagesDetails?: any[];
  transactionLink?: any[];
}
