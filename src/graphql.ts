
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface GetBoardsData {
    title?: string;
    content?: string;
    author?: string;
}

export interface CreateBoardData {
    title: string;
    content: string;
}

export interface UpdateBoardData {
    id: number;
    title?: string;
    content?: string;
}

export interface DeleteBoardData {
    id: number;
}

export interface CreateUserData {
    name: string;
    password: string;
}

export interface LoginUserData {
    name: string;
    password: string;
}

export interface Board {
    id: string;
    createdAt: number;
    updatedAt: number;
    deletedAt?: number;
    title: string;
    content: string;
    author: User;
}

export interface IQuery {
    getBoards(data?: GetBoardsData): Board[] | Promise<Board[]>;
    hello(data?: string): string | Promise<string>;
}

export interface IMutation {
    createBoard(data?: CreateBoardData): Board | Promise<Board>;
    updateBoard(data?: UpdateBoardData): Board | Promise<Board>;
    deleteBoard(data?: DeleteBoardData): boolean | Promise<boolean>;
    createUser(data: CreateUserData): User | Promise<User>;
    deleteUser(): string[] | Promise<string[]>;
    loginUser(data: LoginUserData): string | Promise<string>;
}

export interface User {
    id: string;
    createdAt: number;
    updatedAt: number;
    deletedAt?: number;
    name: string;
    password: string;
    boards: Board[];
}
