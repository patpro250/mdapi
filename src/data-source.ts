import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from './entity/user.entity';
import { Post } from './entity/posts.entity';
import { Announcement } from './entity/announcement.entity';
import { Gallery } from './entity/gallery.entity';
import { Document } from './entity/document.entity';
import { Program } from './entity/program.entity';
import { Testimonial } from './entity/testimonial.entity';
import { Leader } from './entity/leader.entity';

console.log('DB_URL:', process.env.DB_URL);
console.log('POSTS ENTITY:', Post);

const dataSource = new DataSource({
  type: 'postgres',

  url: process.env.DB_URL,

  entities: [User, Post, Announcement, Gallery, Document, Program, Testimonial,Leader],

  migrations: ['src/migrations/*.ts'],
});

export default dataSource;
