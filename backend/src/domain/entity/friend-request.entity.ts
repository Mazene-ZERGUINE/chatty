import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { FriendRequestStatus } from '../enum/friend-request-status.enum';
import { MixinsCrudEntity } from 'nestjs-crud-mixins';

@Entity('friend-request')
export class FriendRequestEntity extends MixinsCrudEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @ManyToOne(() => UserEntity, (user) => user.sentRequests)
  sender: UserEntity;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @ManyToOne(() => UserEntity, (user) => user.receivedRequests)
  receiver: UserEntity;

  @Column({ type: 'enum', enum: FriendRequestStatus })
  requestStatus: FriendRequestStatus;

  constructor() {
    super();
    super.setRelations(['sender', 'receiver']);
  }
}
