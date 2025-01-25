import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'
import { existsSync, readdirSync } from 'node:fs';

const extra: Array<string> = [];

const viewsPath = "./src/db/views";
if (existsSync(viewsPath)) {
  const views = readdirSync(viewsPath)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => `${viewsPath}/${file}`);

  extra.push(...views);
}

const tablesPath = "./src/db/tables";
if (existsSync(tablesPath)) {
  const views = readdirSync(tablesPath)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => `${tablesPath}/${file}`);

  extra.push(...views);
}

export default defineConfig({
  schema: ["./src/db/schema.ts", ...extra],
  out: './.migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  }
})