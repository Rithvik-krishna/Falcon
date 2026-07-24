import argon2 from 'argon2';

/**
 * Argon2id Password Hashing Options:
 * Memory cost: 65536 KB (64 MB)
 * Time cost: 3 iterations
 * Parallelism: 4 threads
 * Variant: Argon2id (side-channel & GPU attack resistant)
 */
const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    return false;
  }
}
