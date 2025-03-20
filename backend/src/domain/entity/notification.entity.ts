import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationType } from '../enum/notification-type.enum';
import { UserEntity } from './user.entity';
import { MixinsCrudEntity } from 'nestjs-crud-mixins';

@Entity('notification')
export class NotificationEntity extends MixinsCrudEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @ManyToOne(() => UserEntity, (user) => user.notifications)
  sender: UserEntity;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'title', type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  content: string;

  @Column({ type: 'enum', enum: NotificationType })
  notificationType: NotificationType;
}
