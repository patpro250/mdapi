import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('documents')
export class Document {
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
        length: 100,
    })
    category!: string;

  @Column({
        name: 'file_name',
        length: 255,
    })
    fileName!: string;

  @Column({
        name: 'file_url',
    })
    fileUrl!: string;

  @Column({
        name: 'object_name',
    })
    objectName!: string;

  @Column({
        name: 'mime_type',
        length: 100,
    })
    mimeType!: string;

  @Column({
        name: 'file_size',
        type: 'bigint',
    })
    fileSize!: number;

  @CreateDateColumn({
        name: 'created_at',
    })
    createdAt!: Date;

  @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt!: Date;
}