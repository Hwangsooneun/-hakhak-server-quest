/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { config } from 'dotenv';
import { resolve } from 'path';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    config({ path: resolve(__dirname, `../.${process.env.NODE_ENV}.env`) });
    console.log(process.env.NODE_ENV);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('HELLO QUERY', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `{
        hello(data: "Hello World!@#")
      }` })
      .expect(200)
      .expect(({ body }) => {
        console.log('HELLO', body)
        expect(body.data.hello).toBe('Hello World!@#');
      });
  });

  it('유저생성', () => {
    const name = 'hakhakhoho';
    const password = 'hoho'
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `mutation {createUser(data: { name: "${name}" password: "${password}"}){name}}` })
      .expect(200)
      .expect(({ body }) => {
        console.log('USER CREATE', body)
        expect(body.data.createUser.name).toBe(name);
      });
  });

  it('유저생성, 이름 중복', () => {
    const name = 'hakhakhoho';
    const password = 'hoho'
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `mutation {createUser(data: { name: "${name}" password: "${password}"}){name}}` })
      .expect(200)
      .expect(({ body }) => {
        console.log('NAME EXIST', body)
        expect(body.errors[0].message).toBe('Name already exist');
      });
  });

  it('유저 로그인', () => {
    const name = 'hakhakhoho';
    const password = 'hoho'
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `mutation {loginUser(data: { name: "${name}" password: "${password}"})}` })
      .expect(200)
      .expect(({ body }) => {
        console.log('USER LOGIN', body)
        const result = body.data.loginUser !== null ? true : false
        expect(result).toBe(true);
        accessToken = `Bearer ${body.data.loginUser}`
        console.log('USER LOGIN', accessToken)
      });
  });

  it('유저 로그인, 잘못된 비밀번호', () => {
    const name = 'hakhakhoho';
    const password = 'hoho1'
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `mutation {loginUser(data: { name: "${name}" password: "${password}"})}` })
      .expect(200)
      .expect(({ body }) => {
        console.log('WRONG PASSWORD', body)
        expect(body.errors[0].message).toBe('Wrong password');
      });
  });

  it('유저 로그인, 가입되어있지 않은 유저', () => {
    const name = 'hakhakhoho1';
    const password = 'hoho'
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: `mutation {loginUser(data: { name: "${name}" password: "${password}"})}` })
      .expect(200)
      .expect(({ body }) => {
        console.log('USER NOT FOUND', body)
        expect(body.errors[0].message).toBe('User not found');
      });
  });

  it('유저삭제', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('authorization', accessToken)
      .send({ query: `mutation { deleteUser }` })
      .expect(200)
      .expect(({ body }) => {
        console.log('USER DELETE', accessToken)
        expect(body.data.deleteUser).toBe(true);
      });
  });

  // it('user create board', () => {
  //   const board = {
  //     title: '학학이 소개',
  //     content: '학학이는 살아있어요',
  //   };

  //   const name = 'hakhak';

  //   return request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({
  //       query: `mutation {createBoard(title: "${board.title}", content:"${board.content}", userName:"${name}"){content}}`,
  //     })
  //     .expect(200)
  //     .expect(({ body }) => {
  //       expect(body.data.createBoard.title).toBe(board.title);
  //     });
  // });

  // it('boards of user', () => {
  //   const name = 'hakhak';

  //   return request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({
  //       query: `query {getBoards(userName:"${name}"){author {name}}}`,
  //     })
  //     .expect(200)
  //     .expect(({ body }) => {
  //       expect(body.data.getBoards).toBe(expect.arrayContaining(['author']));
  //     });
  // });
});
