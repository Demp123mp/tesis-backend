import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { backendDBManager } from 'src/dependency-injection';
import { createUserModel, IUser, UserSchema } from 'src/models/user.model';
import { hash } from 'bcryptjs';

import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersService {
  model = createUserModel(backendDBManager);
  async findAll() {
    return (await this.model.find()).map(user => {
      delete user.__v;
      return user;
    });
  }

  async findById(id: string) {
    try {
      const res = await this.model.findById(id);
      delete res.__v;
      return res;
    } catch (error) {
      return error;
    }
  }

  async findByDocument(document: string) {
    try {
      const res = await this.model.findOneBy({ document });
      delete res.__v;
      console.log("first")
      return res;
    } catch (error) {
      return error;
    }
  }

  async addUser(
    user: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    try {
      const pwd = await hash(user.password, 10);
      const id = randomUUID();
      const newUser = {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: pwd,
        id
      };

      const valid = UserSchema.safeParse(newUser);

      if (!valid.success) {
        const error = valid.error.issues;
        throw new HttpException(
          `Error: ${error.map((err) => `${err.message} on ${err.path[0]}.\n`)}`,
          HttpStatus.BAD_REQUEST
        );
      } else {
        await this.model.insert(newUser);
      }
    } catch (result) {
      const error = result.issues;
      throw new HttpException(
        `Error: ${error.map((err) => `${err.message} on ${err.path[0]}.\n`)}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async update(id: string, body: Partial<IUser>) {
    try {
      const find = await this.findById(id);
      const newSection = { ...find, ...body, updatedAt: new Date() };
      return await this.model.updateById(id, { values: newSection });
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      return this.model.deleteById(id);
    } catch (error) {
      return error;
    }
  }
}
