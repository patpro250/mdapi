import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('gallery')
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 255,
  })
  title!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string;

  @Column({
    nullable: true,
  })
  caption!: string;

  @Column({
    length: 100,
    nullable: true,
  })
  album!: string;

  @Column({
    name: 'image_url',
  })
  imageUrl!: string;

  @Column({
    name: 'object_name',
  })
  objectName!: string;

  @Column({
    name: 'is_featured',
    default: false,
  })
  isFeatured!: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
