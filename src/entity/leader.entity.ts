import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('leaders')
export class Leader {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 250,
  })
  name!: string;

  @Column({
    length: 150,
  })
  position!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio!: string;

  @Column({
    nullable: true,
  })
  photo!: string;

  @Column({
    nullable: true,
    length: 255,
  })
  email!: string;

  @Column({
    nullable: true,
    length: 30,
  })
  phone!: string;

  @Column({
    name: 'display_order',
    default: 0,
  })
  displayOrder!: number;

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
