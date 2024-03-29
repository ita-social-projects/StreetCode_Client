import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

export function createServer(handlersConfig){
    const handlers = handlersConfig.map((config) => {
        return http[config.method || "get"](config.path, () => {
            return (
                HttpResponse.json(config.res)
            );
        })
    })

    const server = setupServer(...handlers);

    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });
    
    afterAll(() => {
        server.close();
    });
}