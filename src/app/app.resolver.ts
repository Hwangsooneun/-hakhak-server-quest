import { Args, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly _appService: AppService) {}
  @Query()
  hello(@Args('data') data?: string) {
    return this._appService.getHello(data);
  }
}
