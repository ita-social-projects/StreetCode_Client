export interface Streetcode {
  id: number;
  transliterationUrl: string;
  title: string;

  index?: number;
  dateString?: string;
  alias?: string | null;
  status?: any;
  eventStartOrPersonBirthDate?: Date;
  eventEndOrPersonDeathDate?: Date | null;
  viewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: any[];
  teaser?: string;
  streetcodeType?: any;
}
