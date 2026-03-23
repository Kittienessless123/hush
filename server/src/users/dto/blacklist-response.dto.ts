export class BlacklistResponseDto {
  id: string;
  user: {
    id: string;
    username: string;
    login: string;
    email: string;
    avatar?: string;
    onlineStatus: boolean;
  };
  reason?: string;
  createdAt: Date;
}
