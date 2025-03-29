import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MixinsCrudEntity } from 'nestjs-crud-mixins';
import { GroupEntity } from './group.entity';
import { FriendRequestEntity } from './friend-request.entity';
import { NotificationEntity } from './notification.entity';

@Entity('users')
export class UserEntity extends MixinsCrudEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @OneToMany(() => FriendRequestEntity, (requests) => requests.sender)
  sentRequests: FriendRequestEntity[];

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @OneToMany(() => FriendRequestEntity, (requests) => requests.receiver)
  receivedRequests: FriendRequestEntity[];

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @ManyToMany(() => UserEntity, (user) => user.contacts)
  @JoinTable({
    name: 'user_contacts',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contactId', referencedColumnName: 'id' },
  })
  contacts: UserEntity[];

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @OneToMany(() => NotificationEntity, (notifcation) => notifcation.user)
  notifications: NotificationEntity[];

  constructor() {
    super();
    this.setRelations(['notifications', 'contacts']);
  }
}
