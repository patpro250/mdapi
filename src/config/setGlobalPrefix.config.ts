import { INestApplication } from '@nestjs/common';

export const setGlobalPrefix = (app: INestApplication) => {
 app.setGlobalPrefix('/mdapi');
};
