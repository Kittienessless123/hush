import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class WsExceptionFilter<T> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost): void;
}
