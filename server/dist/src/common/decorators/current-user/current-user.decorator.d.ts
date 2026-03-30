export interface CurrentUserPayload {
    [x: string]: any;
    id: string;
    username: string;
    login: string;
    email?: string;
    tokenId?: string;
    deviceInfo?: string;
    iat?: number;
    exp?: number;
    role?: string;
}
export declare const CurrentUser: (...dataOrPipes: (keyof CurrentUserPayload | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
