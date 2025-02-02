import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import StreetcodeArtSlide from '@models/media/streetcode-art-slide.model';

import StreetcodeArt from '@/models/media/streetcode-art.model';

const StreetcodeArtApi = {
    getAll: () => (
        Agent.get<StreetcodeArt[]>(`${API_ROUTES.STREETCODE_ARTS.GET_ALL}`)
    ),

    getStreetcodeArtsByStreetcodeId: (streetcodeId: number) => (
        Agent.get<StreetcodeArt[]>(`${API_ROUTES.STREETCODE_ARTS.GET_BY_STREETCODE_ID}/${streetcodeId}`)
    ),

    getArtSlidesByStreetcodeId: (
        streetcodeId: number,
        startFromSlide: number,
        amountOfSlides: number,
    ) => (
        Agent.get<StreetcodeArtSlide[]>(
            `${API_ROUTES.STREETCODE_ART_SLIDES.GET_SLIDES_BY_STREETCODE_ID}/${streetcodeId}`,
            new URLSearchParams(Object.entries({ fromSlideN: startFromSlide.toString(),
                                                 amountOfSlides: amountOfSlides.toString() })),
        )
    ),

    getAllCountByStreetcodeId: (streetcodeId: number) => (
        Agent.get<number>(`${API_ROUTES.STREETCODE_ART_SLIDES.GET_ALL_COUNT_BY_STREETCODE_ID}/${streetcodeId}`)
    ),
};

export default StreetcodeArtApi;
