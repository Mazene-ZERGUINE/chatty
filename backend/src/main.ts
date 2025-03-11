import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
bootstrap()
  .then((): void => console.log('Server running on port 3000'))
  .catch((err): void => console.log(err));
