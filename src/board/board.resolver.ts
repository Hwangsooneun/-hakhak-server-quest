import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UserPayloadDto } from 'src/common/dto/user.payload.dto';
import { CreateBoardData } from '../graphql';
import { BoardService } from './board.service';

@Resolver()
export class BoardResolver {
  constructor(
    private boardService: BoardService
  ) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  createBoard(
    @Args ('data') data: CreateBoardData,
    @CurrentUser() user: UserPayloadDto
    ) {
      return this.boardService.createBoard(data.title, data.content, user.id)
  }
}
