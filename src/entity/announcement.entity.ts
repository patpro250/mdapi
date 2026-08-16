import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AnnouncementStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  EXPIRED = 'EXPIRED',
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column({
        length: 455,
    })
    title!: string;

  @Column({
        type: 'text',
    })
    content!: string;

  @Column({
        type: 'enum',
        enum: AnnouncementStatus,
        default: AnnouncementStatus.DRAFT,
    })
    status!: AnnouncementStatus;

  @Column({
        default: 0,
    })
    priority!: number;

  @Column({
        name: 'published_at',
        type: 'timestamp',
        nullable: true,
    })
    publishedAt!: Date;

  @Column({
        name: 'expires_at',
        type: 'timestamp',
        nullable: true,
    })
    expiresAt!: Date;

  @CreateDateColumn({
        name: 'created_at',
    })
    createdAt!: Date;

  @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt!: Date;
}