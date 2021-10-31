import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.model';
import { Repository } from 'typeorm';
import { Board } from './board.model';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private _boardRepository: Repository<Board>,
    private readonly _userRepository: Repository<User>
    ) {
    console.log('use this repository board', Board);
  }
}
