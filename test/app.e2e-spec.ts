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
  let boardId: number;

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
        const result = body.data.loginUser !== null ? true : false
        expect(result).toBe(true);
        accessToken = `Bearer ${body.data.loginUser}`
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
        expect(body.errors[0].message).toBe('User not found');
      });
  });

  it('게시판 생성', () => {
    const board = {
      title: '학학이 소개',
      content: '학학이는 살아있어요',
    };
    return request(app.getHttpServer())
      .post('/graphql')
      .set('authorization', accessToken)
      .send({
        query: `mutation {createBoard( data: { title: "${board.title}", content:"${board.content}" } ){ title, content, id }}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.createBoard.title).toBe(board.title);
        expect(body.data.createBoard.content).toBe(board.content);
        boardId = body.data.createBoard.id
      });
  });

  it('게시판 생성, 토큰 없음', () => {
    const board = {
      title: '학학이 소개',
      content: '학학이는 살아있어요',
    };
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {createBoard( data: { title: "${board.title}", content:"${board.content}" } ){ title, content, id }}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe('Invalid token');
      });
  });

  it('게시판 검색, 이름으로 검색', () => {
    const name = 'hakhakhoho'
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{ getBoards(data: { author: "${name}" }){ title, content, author { name } }}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.getBoards[0].author.name).toBe(name);
      });
  });

  it('게시판 검색, 제목으로 검색', () => {
    const title = '학학'
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{ getBoards(data: { title: "${title}" }){ title, content, author { name } }}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.getBoards[0].title).toContain(title);
      });
  });

  it('게시판 검색, 내용으로 검색', () => {
    const content = '어요'
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{ getBoards(data: { content: "${content}" }){ title, content, author { name } }}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.getBoards[0].content).toContain(content);
      });
  });

  it('게시판 수정', () => {
    const title = '학학이 수정'
    const content = '학학이는 바뀔거에요'
    return request(app.getHttpServer())
      .post('/graphql')
      .set('authorization', accessToken)
      .send({
        query: `mutation {updateBoard( data: { id: ${boardId}, title: "${title}", content: "${content}" } ){ title, content, id }}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.updateBoard.title).toBe(title);
        expect(body.data.updateBoard.content).toBe(content);
      });
  });

  it('게시판 수정, 토큰 없음', () => {
    const title = '학학이 수정'
    const content = '학학이는 바뀔거에요'
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {updateBoard( data: { id: ${boardId}, title: "${title}" } ){ title, content, id }}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe('Invalid token');
      });
  });

  it('게시판 수정, 수정할 내용 없음', () => {
    const title = '학학이 수정'
    const content = '학학이는 바뀔거에요'
    return request(app.getHttpServer())
      .post('/graphql')
      .set('authorization', accessToken)
      .send({
        query: `mutation {updateBoard( data: { id: ${boardId} } ){ title, content, id }}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe('Require title or content');
      });
  });

  it('게시판 수정, 본인글만 수정할 수 있음', () => {
    const title = '학학이 수정'
    const content = '학학이는 바뀔거에요'
    return request(app.getHttpServer())
      .post('/graphql')
      .set('authorization', accessToken)
      .send({
        query: `mutation {updateBoard( data: { id: ${boardId - 1}, title: "${title}", content: "${content}" } ){ title, content, id }}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe('Cannot update board');
      });
  });

  it('게시판 삭제', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('authorization', accessToken)
      .send({
        query: `mutation {deleteBoard( data: { id: ${boardId} } )}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.deleteBoard).toBe(true);
      });
  });

  it('게시판 삭제, 토큰 없음', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {deleteBoard( data: { id: ${boardId} } )}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe('Invalid token');
      });
  });

  it('게시판 삭제, 본인글만 삭제할 수 있음', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('authorization', accessToken)
      .send({
        query: `mutation {deleteBoard( data: { id: ${boardId - 1} } )}`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe('Cannot delete board');
      });
  });

  it('유저삭제', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('authorization', accessToken)
      .send({ query: `mutation { deleteUser }` })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.deleteUser).toBe(true);
      });
  });
});
