// positions.api.mock.ts
// Import the mock module
import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { Positions } from '@models/team/team.model';

// Mock the entire module
jest.mock('@api/agent.api', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

const mockPositions: Positions[] = [{ id: 1, position: 'MockPosition' }];

// Mock the specific method
(Agent.get as jest.Mock).mockImplementation((url: string) => {
    if (url === API_ROUTES.POSITIONS.GET_ALL) {
        return Promise.resolve(mockPositions);
    }

    // Add other mock implementations as needed
    return Promise.resolve([]);
});

export default Agent;
