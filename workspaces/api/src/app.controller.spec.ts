import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('AppController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // @TODO: Find a better way to handle duplication
    await app.init();
  });

  describe('root', () => {
    it('should return bad request when startTime is missing', async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return request(app.getHttpServer())
        .get('/profit')
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toEqual(
            expect.arrayContaining(['startTime should not be empty']),
          );
          expect(body.message).toEqual(
            expect.arrayContaining(['endTime should not be empty']),
          );
        });
    });

    it('should return bad request when startTime is after endTime', () => {
      return request(app.getHttpServer())
        .get('/profit')
        .query({
          startTime: new Date(2024, 0, 1).toISOString(),
          endTime: new Date(2023, 0, 1).toISOString(),
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toEqual(
            expect.arrayContaining(['endTime should be later than startTime']),
          );
        });
    });

    it('should return error when startTime is before first available date', async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return request(app.getHttpServer())
        .get('/profit')
        .query({
          startTime: new Date(2000, 0, 1).toISOString(),
          endTime: new Date(2000, 1, 1).toISOString(),
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toEqual(
            'startTime is outside available data range.', // @TODO: Unify response of errors
          );
        });
    });

    it('should return error when endTime is after last available date', async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return request(app.getHttpServer())
        .get('/profit')
        .query({
          startTime: new Date(2023, 9, 16, 23, 10).toISOString(),
          endTime: new Date(2024, 1, 1).toISOString(),
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toEqual(
            'endTime is outside available data range.',
          );
        });
    });

    it('should return error due to no profit', async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return request(app.getHttpServer())
        .get('/profit')
        .query({
          startTime: new Date(2023, 9, 16, 23, 9, 16, 0).toISOString(),
          endTime: new Date(2023, 9, 16, 23, 9, 16, 1).toISOString(),
        })
        .expect(400)
        .expect(({ body }) => {
          console.log(body);
          expect(body.message).toEqual('No profit for selected time range.');
        });
    });
  });
});
