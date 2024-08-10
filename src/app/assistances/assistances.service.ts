import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { backendDBManager } from 'src/dependency-injection';
import {
  IAssistance,
  createAssistanceModel
} from 'src/models/assistance.model';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AssistanceService {
  model = createAssistanceModel(backendDBManager);

  async findAll() {
    try {
      const response = await this.model.find();
      return response.map((assistance) => {
        delete assistance.__v;
        return assistance;
      });
    } catch (error) {
      return error;
    }
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

  async addAssistances(
    assistance: Omit<IAssistance, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    try {
      const id = randomUUID();
      const newAssistance = {
        ...assistance,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        id
      };
      //console.log(newAssistance);
      await this.model.insert(newAssistance);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error al agregar la asistencia',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, body: Partial<IAssistance>) {
    try {
      const find = await this.findById(id);
      if (!find) {
        throw new HttpException(
          'Asistencia no encontrada',
          HttpStatus.NOT_FOUND
        );
      }
      const newAssistance: IAssistance = {
        ...find,
        ...body,
        updatedAt: new Date()
      };
      await this.model.updateById(id, { values: newAssistance });
      return newAssistance;
    } catch (error) {
      throw new HttpException(
        'Error al editar la asistencia',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async removeAssistance(id: string) {
    try {
      return this.model.deleteById(id);
    } catch (error) {
      return error;
    }
  }
}
