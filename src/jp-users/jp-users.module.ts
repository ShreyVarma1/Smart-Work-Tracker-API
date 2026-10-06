import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JpUser, JpUserSchema } from './schemas/jp-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: JpUser.name, schema: JpUserSchema }]),
  ],
  exports: [MongooseModule],
})
export class JpUsersModule {}
