import { FriendStatus } from 'src/generated/enums';

export class FriendRequestResponseDto {
  id: string;
  status: FriendStatus;
  user: {
    id: string;
    username: string;
    login: string;
    email: string;
    avatar?: string;
  };
  friend: {
    id: string;
    username: string;
    login: string;
    email: string;
    avatar?: string;
  };
  createdAt: Date;
}

export class FriendResponseDto {
  id: string;
  user: {
    id: string;
    username: string;
    login: string;
    email: string;
    avatar?: string;
    onlineStatus: boolean;
    lastSeen?: Date;
  };
  friend: {
    id: string;
    username: string;
    login: string;
    email: string;
    avatar?: string;
    onlineStatus: boolean;
    lastSeen?: Date;
  };
  status: FriendStatus;
  createdAt: Date;
}
