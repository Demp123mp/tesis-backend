import tsValidMongoDb, { Schema } from 'ts-valid-mongodb';
import { z } from 'zod';

// Expresión regular para validar un ObjectId de MongoDB
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const AssistanceSchema = z.object({
  worker: z.string().refine((val) => objectIdRegex.test(val), {
    message: "Invalid MongoDB ObjectId",
  }),
  date: z.date(),
  type: z.enum(['in', 'out']),
  createdAt: z.date(),
  updatedAt: z.date()
});

type IAssistance = z.infer<typeof AssistanceSchema>;

const createAssistanceModel = (db: tsValidMongoDb) =>
  db.createModel(
    new Schema('assistance', AssistanceSchema, {
      versionKey: true,
      indexes: [{ key: { id: 1 }, unique: true }]
    })
  );

export { IAssistance, createAssistanceModel, AssistanceSchema };
