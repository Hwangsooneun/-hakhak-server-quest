import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.model';
import { Repository } from 'typeorm';
import { Board } from './board.model';

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
}
