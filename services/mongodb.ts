/**
 * services/mongodb.ts
 * Conexión singleton a MongoDB usando la librería oficial (mongodb).
 *
 * Requisitos:
 * - Añade `MONGODB_URI` y opcionalmente `MONGODB_DB` en `.env.local`.
 * - Instala: `npm install mongodb` (o `pnpm add mongodb` / `yarn add mongodb`).
 *
 * Uso:
 * import { getDb } from '@/services/mongodb';
 * const db = await getDb();
 */

import { MongoClient, Db } from "mongodb";

declare global {
  // Allow global caching of the client promise in development (HMR)
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const defaultDb = process.env.MONGODB_DB || "test";

if (!uri) {
  throw new Error("Define la variable de entorno MONGODB_URI en .env.local");
}

const options = {} as Record<string, unknown>;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so HMR doesn't create new connections
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  // In production (or non-dev), create a new client (server lifecycle will reuse it)
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(dbName = defaultDb): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}

export default getDb;
