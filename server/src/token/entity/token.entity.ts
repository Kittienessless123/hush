export class Token {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  deviceInfo?: string;
  revoked: boolean;
  createdAt: Date;
}
