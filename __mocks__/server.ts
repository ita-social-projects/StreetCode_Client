/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const mockHost = 'https://mock_url.com/';

type HttpMethodType =
    'get' |
    'post' |
    'put' |
    'delete' |
    'patch' |
    'options' |
    'head' |
    'all';

type SuccessRequestOptions = {
    type?: 'success';
    responseFn: any;
};

type ErrorRequestOptions = {
    type: 'error';
    errorStatusCode?: number;
};

type CommonRequestOptions = {
    method: HttpMethodType;
    path: string;
};

type CreateMockServerProps =
    (CommonRequestOptions & SuccessRequestOptions) | (CommonRequestOptions & ErrorRequestOptions);

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

export default function createMockServer(handlersConfig: CreateMockServerProps[]) {
    const handlers = handlersConfig.map(
        (config: CreateMockServerProps) => {
            const requestUrl = mockHost + config.path;
            return httpMethod[config.method || 'get'](requestUrl, (request: any, response: any, context: any) => {
                if (config.type === 'error') {
                    return response(
                        context.status(config.errorStatusCode ?? 400),
                    );
                }

                return response(
                    context.json(
                        config.responseFn(),
                    ),
                );
            });
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
