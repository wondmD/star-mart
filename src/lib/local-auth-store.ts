import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

import { User } from '@/types';

const dataDirectory = path.join(process.cwd(), '.data');
const usersFilePath = path.join(dataDirectory, 'users.json');
const sessionsFilePath = path.join(dataDirectory, 'sessions.json');

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

interface StoredUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  password_hash: string;
  password_salt: string;
  created_at: string;
}

interface StoredSession {
  token: string;
  user_id: string;
  expires_at: string;
}

export const DEMO_USER = {
  email: 'demo@example.com',
  password: 'Demo@123',
  full_name: 'Demo User',
} as const;

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, salt: string, passwordHash: string): boolean {
  const derived = hashPassword(password, salt);
  const derivedBuffer = Buffer.from(derived, 'hex');
  const storedBuffer = Buffer.from(passwordHash, 'hex');

  if (derivedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedBuffer, storedBuffer);
}

function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    phone: user.phone,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  };
}

async function readUsers(): Promise<StoredUser[]> {
  return readJsonFile<StoredUser[]>(usersFilePath, []);
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await writeJsonFile(usersFilePath, users);
}

async function readSessions(): Promise<StoredSession[]> {
  return readJsonFile<StoredSession[]>(sessionsFilePath, []);
}

async function writeSessions(sessions: StoredSession[]): Promise<void> {
  await writeJsonFile(sessionsFilePath, sessions);
}

function pruneExpiredSessions(sessions: StoredSession[]): StoredSession[] {
  const now = Date.now();
  return sessions.filter((session) => new Date(session.expires_at).getTime() > now);
}

export async function ensureDemoUser(): Promise<User> {
  const users = await readUsers();
  const existing = users.find(
    (user) => user.email.toLowerCase() === DEMO_USER.email.toLowerCase(),
  );

  if (existing) {
    return toPublicUser(existing);
  }

  const salt = randomBytes(16).toString('hex');
  const demoUser: StoredUser = {
    id: randomUUID(),
    email: DEMO_USER.email,
    full_name: DEMO_USER.full_name,
    password_salt: salt,
    password_hash: hashPassword(DEMO_USER.password, salt),
    created_at: new Date().toISOString(),
  };

  await writeUsers([...users, demoUser]);
  return toPublicUser(demoUser);
}

export async function createLocalUser(input: {
  email: string;
  password: string;
  full_name: string;
}): Promise<User> {
  const users = await readUsers();
  const normalizedEmail = input.email.trim().toLowerCase();

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists');
  }

  const salt = randomBytes(16).toString('hex');
  const newUser: StoredUser = {
    id: randomUUID(),
    email: normalizedEmail,
    full_name: input.full_name.trim(),
    password_salt: salt,
    password_hash: hashPassword(input.password, salt),
    created_at: new Date().toISOString(),
  };

  await writeUsers([...users, newUser]);
  return toPublicUser(newUser);
}

export async function authenticateLocalUser(
  email: string,
  password: string,
): Promise<User> {
  await ensureDemoUser();

  const users = await readUsers();
  const user = users.find(
    (storedUser) => storedUser.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
    throw new Error('Invalid email or password');
  }

  return toPublicUser(user);
}

export async function createLocalSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const sessions = pruneExpiredSessions(await readSessions());

  sessions.push({
    token,
    user_id: userId,
    expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  });

  await writeSessions(sessions);
  return token;
}

export async function deleteLocalSession(token: string): Promise<void> {
  const sessions = await readSessions();
  await writeSessions(sessions.filter((session) => session.token !== token));
}

export async function getLocalUserByToken(token: string): Promise<User | null> {
  const sessions = pruneExpiredSessions(await readSessions());
  const activeSession = sessions.find((session) => session.token === token);

  if (!activeSession) {
    if (sessions.length !== (await readSessions()).length) {
      await writeSessions(sessions);
    }
    return null;
  }

  const users = await readUsers();
  const user = users.find((storedUser) => storedUser.id === activeSession.user_id);

  return user ? toPublicUser(user) : null;
}

export async function getLocalUserById(userId: string): Promise<User | null> {
  const users = await readUsers();
  const user = users.find((storedUser) => storedUser.id === userId);
  return user ? toPublicUser(user) : null;
}
