import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';

import { AnnouncementsModule } from './announcements/announcements.module';

import { DocumentsModule } from './documents/documents.module';
import { ProgramsModule } from './programs/programs.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { LeadersModule } from './leaders/leaders.module';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import { GalleryModule } from './gallery/gallery.module';
import { MinioModule } from './minio/minio.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        url: configService.get<string>('DB_URL'),

        autoLoadEntities: true,

        synchronize: false,
      }),
    }),

    UserModule,

    PostsModule,

    AnnouncementsModule,

    // GalleryModule,

    DocumentsModule,

    ProgramsModule,

    TestimonialsModule,

    LeadersModule,

    GalleryModule,

    MinioModule,

    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
