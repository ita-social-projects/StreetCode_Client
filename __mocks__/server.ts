/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const mockHost = 'https://mock_url.com/';

const httpMethod: { [index: string]:any } = {
    get: rest.get,
    post: rest.post,
    put: rest.put,
    patch: rest.patch,
    delete: rest.delete,
    head: rest.head,
    options: rest.options,
    all: rest.all,
};

export default function createMockServer(handlersConfig: any) {
    const handlers = handlersConfig.map(
        (config: any) => {
            const requestUrl = mockHost + config.path;
            console.log(config.res());
            return httpMethod[config.method || 'get'](requestUrl, (req: any, res: any, ctx: any) => res(
                ctx.json(
                    config.res(req, res, ctx),
                ),
            ));
        },
    );

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
