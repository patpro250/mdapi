import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 150,
  })
  name!: string;

  @Column({
    length: 100,
    nullable: true,
  })
  role!: string;

  @Column({
    type: 'text',
  })
  content!: string;

  @Column({
    nullable: true,
  })
  avatar!: string;

  @Column({
    name: 'is_featured',
    default: false,
  })
  isFeatured!: boolean;

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive!: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
