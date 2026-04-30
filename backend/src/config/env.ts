import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const EnvSchema = z.object({
  PORT: z.string().optional(),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  OPENAI_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development','production','test']).default('development'),
  FRONTEND_URL: z.string().url(),
});
export type Env = z.infer<typeof EnvSchema>;

const rawEnv = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NODE_ENV: (process.env.NODE_ENV as string) ?? 'development',
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:3000',
};

export const env: Env = EnvSchema.parse(rawEnv);
export default env;
