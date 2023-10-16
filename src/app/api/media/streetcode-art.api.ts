import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

import StreetcodeArt from '@/models/media/streetcode-art.model';
import StreetcodeArtSlide from "@models/media/streetcode-art-slide.model"

const StreetcodeArtApi = {
    getAll: () => Agent.get<StreetcodeArt[]>(`${API_ROUTES.STREETCODE_ARTS.GET_ALL}`),

    getStreetcodeArtsByStreetcodeId: (streetcodeId: number) => Agent.get<StreetcodeArt[]>(
        `${API_ROUTES.STREETCODE_ARTS.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    getArtSlidesByStreetcodeId: (streetcodeId: number,  startFromSlide: number, amountOfSlides: number) => Agent.get<StreetcodeArtSlide[]>(
        `${API_ROUTES.STREETCODE_ART_SLIDES.GET_SLIDES_BY_STREETCODE_ID}/${streetcodeId}`,
        new URLSearchParams(Object.entries({ fromSlideN: startFromSlide.toString(), amountOfSlides: amountOfSlides.toString() })),
    ),
};

export default StreetcodeArtApi;
