import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { backendDBManager } from 'src/dependency-injection';
import { createUserModel, IUser } from 'src/models/user.model';
import { compare } from "bcryptjs";

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService
  ) {}


  model = createUserModel(backendDBManager);

  async login(
    user: Pick<IUser, 'document' | 'password'>,
  ): Promise<{ user: IUser, token: string }> {
    const find = await this.model.findOneBy({ document: user.document });
    if (!find) throw new HttpException('DOCUMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    const checkPwd = await compare(user.password, find.password);
    if (!checkPwd) throw new HttpException('INVALID_PASSWORD', HttpStatus.UNAUTHORIZED);

    delete find.__v;
    
    const token = this.jwtService.sign({
      document: find.document,
    });

    return {
      user: find,
      token
    };
  }
}
