export interface D1Database {
  prepare(sql: string): D1PreparedStatement
  dump(): Promise<ArrayBuffer>
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>
  exec(sql: string): Promise<D1Result>
}
export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement
  first<T = unknown>(col?: string): Promise<T | null>
  run(): Promise<D1Result>
  all<T = unknown>(): Promise<D1Result<T>>
  raw(): Promise<unknown[][]>
}
export interface D1Result<T = unknown> {
  results: T[]; success: boolean
  meta: { duration: number; changes: number; last_row_id: number; served_by: string; size: number; rows_read: number; rows_written: number }
}

export function getDB(context: any): D1Database {
  const db: D1Database | undefined = context?.env?.DB
  if (!db) throw new Error('D1 Database not bound. Set binding "DB" di wrangler.toml')
  return db
}

export async function insert(db: D1Database, table: string, data: Record<string, any>): Promise<D1Result> {
  const keys = Object.keys(data); const values = Object.values(data)
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`
  return db.prepare(sql).bind(...values).run()
}

export async function update(db: D1Database, table: string, data: Record<string, any>, whereKey: string, whereValue: any): Promise<D1Result> {
  const keys = Object.keys(data); const values = Object.values(data)
  const sql = `UPDATE ${table} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE ${whereKey} = ?`
  return db.prepare(sql).bind(...values, whereValue).run()
}

export async function select<T = any>(db: D1Database, table: string, where?: Record<string, any>, orderBy?: string, limit?: number): Promise<T[]> {
  let sql = `SELECT * FROM ${table}`; const values: any[] = []
  if (where) {
    sql += ` WHERE ${Object.keys(where).map(k => `${k} = ?`).join(' AND ')}`
    values.push(...Object.values(where))
  }
  if (orderBy) sql += ` ORDER BY ${orderBy}`
  if (limit) sql += ` LIMIT ${limit}`
  const stmt = db.prepare(sql)
  if (values.length > 0) stmt.bind(...values)
  return (await stmt.all<T>()).results
}
