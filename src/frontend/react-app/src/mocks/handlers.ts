import { rest } from 'msw';

export const handlers = [
  // Example handler for API mocking
  rest.get('/api/user', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
      })
    );
  }),

  // Add more handlers as needed for various API endpoints
  rest.get('/api/visualization-data', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          { id: 1, name: 'Dataset 1', value: 10 },
          { id: 2, name: 'Dataset 2', value: 20 },
          { id: 3, name: 'Dataset 3', value: 15 },
        ],
      })
    );
  }),

  // Example POST handler
  rest.post('/api/visualization-params', async (req, res, ctx) => {
    const body = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        params: body
      })
    );
  }),
];
