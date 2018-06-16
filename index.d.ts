declare module "@irysius/utils" {
    import * as _fs from "@irysius/utils/fs";
    import * as _Logger from "@irysius/utils/Logger";
    import * as _IgnoreError from "@irysius/utils/IgnoreError";
    import * as _HttpError from "@irysius/utils/HttpError";
    export let fs: typeof _fs;
    export let Logger: typeof _Logger;
    export let IgnoreError: typeof _IgnoreError;
    export let HttpError: typeof _HttpError;
}

declare module "@irysius/utils/fs" {
    import { Stats } from "fs";
    export function stat(path: string): Promise<Stats>;
    export interface IWriteFileOptions {
        encoding?: string;
        mode?: number;
        flag?: string;
    }
    export function writeFile(file: string, data: string|any, options?: IWriteFileOptions): Promise<void>;
    export interface IReadFileOptions {
        encoding?: string;
        flag?: string;
    }
    export function readFile(file: string, options?: string|IReadFileOptions): Promise<string|Buffer>;
    export function removeFile(file: string): Promise<void>;
    export function moveFile(source: string, target: string): Promise<void>;
    export function copyFile(source: string, target: string): Promise<void>;
    export function chmod(file: string, mode): Promise<void>;
    export function removeFolder(path: string): Promise<void>;
    export function assertFolder(path: string): Promise<void>;
    export function moveFolder(source: string, target: string): Promise<void>;
    export function copyFolder(source: string, target: string): Promise<void>;
    export interface IRecord {
        path: string;
        stat: Stats;
    }
    export interface IFilterOptions {
        filter?(record: IRecord): boolean;
    }
    export function listContents(path: string, options?: IFilterOptions): Promise<IRecord[]>;
    export interface IRecurseOptions {
        recurse?: boolean;
        ignore?: string|string[];
    }
    export function listFiles(path: string, options?: IRecurseOptions): Promise<IRecord[]>;
    export function listDirectories(path: string, options?: IRecurseOptions): Promise<IRecord[]>;
}
declare module "@irysius/utils/Logger" {
    export interface ILogger {
        info: Function;
        warn: Function;
        error: Function;
        log: Function;
    }
    export function silent(): ILogger;
    export function console(): ILogger;
    export function isLoggerValid(logger: any): boolean;
    export function stackFilter(stack: string): string;
}
declare module "@irysius/utils/IgnoreError" {
    class IgnoreError extends Error {
        constructor();
        name: 'IgnoreError';
        message: string;
        stack: string;
    }
    namespace IgnoreError {}
    export = IgnoreError;
}
declare module "@irysius/utils/HttpError" {
    class HttpError extends Error {
        constructor(message: string, statusCode?: number);
        name: 'HttpError';
        message: string;
        statusCode: number;
        stack: string;
    }
    namespace HttpError {}
    export = HttpError;
}