export declare class User {
    id: string | number;
    username: string;
    login: string;
    passwordHash: string;
    email?: string;
    avatar?: string;
    lastSeen?: Date;
    onlineStatus: boolean;
    phone?: string;
    description?: string;
}
