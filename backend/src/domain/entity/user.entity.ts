import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MixinsCrudEntity } from 'nestjs-crud-mixins';
import { GroupEntity } from './group.entity';

@Entity('users')
export class UserEntity extends MixinsCrudEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 60, unique: false, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 250, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: false })
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: false })
  bio?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true, default: null, length: 255 })
  avatarUrl: string;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @ManyToMany(() => GroupEntity, (group) => group.members)
  groups: GroupEntity[];

  // TODO: Add account profile configurations, Contacts, Friend Requests, Notifications and //
}
