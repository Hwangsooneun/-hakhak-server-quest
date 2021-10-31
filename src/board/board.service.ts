import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.model';
import { Repository } from 'typeorm';
import { Board } from './board.model';
import { ApolloError } from 'apollo-server-errors';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private _boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>
    ) {}
  
    public async createBoard(title: string, content: string, userId: number) {
      const user = await this._userRepository.findOne({
        where: { id: userId }
      })

      const board = new Board()
      board.title = title
      board.content = content
      board.author = user

      return this._boardRepository.save(board)
    }

    public async getBoards(data) {
      const boards = await this._boardRepository
        .createQueryBuilder('board')
          .innerJoin('board.author', 'user', 
          data.author ? 'user.name = :name' : '', 
          data.author ? { name: data.author } : {})
          .where('title like :title', 
          data.title ? { title: `%${data.title}%` } : { title: '%%' })
          .andWhere('content like :content', 
          data.content ? { content: `%${data.content}%` } : { content: '%%' })
        .getMany()

      if (boards.length) {
        return boards
      }
      throw new ApolloError('No data found')
    }
}
