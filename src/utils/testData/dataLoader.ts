// utils/dataLoader.ts
import fs from 'fs';
import path from 'path';
import { DataRegistry } from './dataTypes';

export class DataLoader {
  private static cache: Map<string, any> = new Map();

  public static get<K extends keyof DataRegistry>(moduleName: K): DataRegistry[K] {
    const env = (process.env.ENV || 'dev').toLowerCase();
    const cacheKey = `${String(moduleName)}:${env}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const filePath = path.resolve(
      process.cwd(),
      `test-data/${String(moduleName)}/${String(moduleName)}.${env}.json`
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`[DataLoader Error] File not found: ${filePath}`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    this.cache.set(cacheKey, data);
    return data;
  }
}