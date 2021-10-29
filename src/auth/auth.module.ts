import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.model';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}` || 'gogo',
      signOptions: { expiresIn: '1 day' },
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}