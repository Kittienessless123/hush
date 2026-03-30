import type { UserSettings } from '@prisma/client';
export declare class UserResponseDto {
    id: string;
    username: string;
    login: string;
    email: string;
    avatar?: string;
    phone?: string;
    description?: string;
    onlineStatus: boolean;
    lastSeen?: Date;
    createdAt: Date;
    updatedAt: Date;
    settings?: UserSettings;
    passwordHash: string;
    publicKey?: string;
    constructor(partial: Partial<UserResponseDto>);
}
export declare class UserCompactDto {
    id: string;
    username: string;
    login: string;
    email: string;
    avatar?: string;
    onlineStatus: boolean;
    lastSeen?: Date;
    constructor(partial: Partial<UserCompactDto>);
}
