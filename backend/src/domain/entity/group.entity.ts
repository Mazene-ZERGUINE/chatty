import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MixinsCrudEntity } from 'nestjs-crud-mixins';

@Entity('groups')
export class GroupEntity extends MixinsCrudEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'group_name', type: 'varchar', length: 60, unique: true })
  groupName: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
    name: 'description',
    unique: false,
  })
  description?: string;

  @Column({
    type: 'boolean',
    default: true,
    name: 'is_active',
    nullable: false,
  })
  isActive: boolean;

  @Column({
    name: 'is_private',
    nullable: false,
    type: 'boolean',
    default: false,
  })
  isPrivate: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: false })
  imageUrl: string;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @ManyToMany(() => UserEntity, (user) => user.groups)
  @JoinTable()
  members: UserEntity[];

  constructor() {
    super();
    this.setRelations(['members']);
  }
}
