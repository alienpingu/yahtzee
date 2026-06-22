import Database from 'better-sqlite3';
import { randomBytes } from 'crypto';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || './data/yatzy.db';
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting',
    state TEXT
  );
`);

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function genCode() {
  const exists = db.prepare('SELECT 1 FROM games WHERE code = ?');
  for (let i = 0; i < 100; i++) {
    const bytes = randomBytes(4);
    let code = '';
    for (let j = 0; j < 4; j++) code += CODE_CHARS[bytes[j] % CODE_CHARS.length];
    if (!exists.get(code)) return code;
  }
  throw new Error('Could not generate unique game code');
}

export function getOrCreatePlayer(name) {
  const existing = db.prepare('SELECT * FROM players WHERE name = ?').get(name);
  if (existing) return existing;
  const info = db.prepare('INSERT INTO players (name) VALUES (?)').run(name);
  return db.prepare('SELECT * FROM players WHERE id = ?').get(info.lastInsertRowid);
}

export function getPlayer(id) {
  return db.prepare('SELECT * FROM players WHERE id = ?').get(id);
}

export function createGame() {
  const code = genCode();
  const info = db.prepare('INSERT INTO games (code, status) VALUES (?, ?)').run(code, 'waiting');
  return db.prepare('SELECT * FROM games WHERE id = ?').get(info.lastInsertRowid);
}

export function getGameById(id) {
  return db.prepare('SELECT * FROM games WHERE id = ?').get(id);
}

export function getGameByCode(code) {
  return db.prepare('SELECT * FROM games WHERE code = ?').get(String(code).toUpperCase());
}

export function saveGame(game) {
  db.prepare('UPDATE games SET state = ?, status = ? WHERE id = ?').run(
    JSON.stringify(game.toState()), game.status, game.id
  );
}

export function listActiveGames() {
  return db.prepare(`SELECT * FROM games WHERE status IN ('waiting', 'in_progress')`).all();
}
