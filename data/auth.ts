import 'server-only';

const { randomBytes, scrypt } = await import('node:crypto');
const { promisify } = await import('node:util');

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await promisify(scrypt)(password, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const [salt, hashedPassword] = hash.split(':');
  const derivedKey = (await promisify(scrypt)(password, salt, 64)) as Buffer;

  return hashedPassword === derivedKey.toString('hex');
}
