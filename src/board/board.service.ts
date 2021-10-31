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
        .innerJoinAndSelect('board.author', 'user', 
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

  public async updateBoard(data, userId: number) {
    if (!data.title && !data.content) {
      throw new ApolloError('Require title or content')
    }

    const { id, ...withOutId } = data
    const board = await this._boardRepository
      .createQueryBuilder('board')
      .innerJoin('board.author', 'user', 'user.id = :userId', {
        userId
      })
      .where('board.id = :id', { id })
      .getOne()

    if (!board) {
      throw new ApolloError('Cannot update board')
    }

    for (const el in withOutId) {
      board[el] = withOutId[el]
    }
    return this._boardRepository.save(board)
  }

  public async deleteBoard(boardId: number, userId: number) {
    const board = await this._boardRepository
      .createQueryBuilder('board')
      .innerJoin('board.author', 'user', 'user.id = :userId', {
        userId
      })
      .where('board.id = :id', { id: boardId })
      .getOne()
    
    if (!board) {
      throw new ApolloError('Cannot delete board')
    }

    const result = await this._boardRepository.delete({
      id: boardId
    })

    return result.affected === 1 ? true : false
  }
}
