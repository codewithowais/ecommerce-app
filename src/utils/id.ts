import { randomUUID } from 'node:crypto';

export function nanoid(): string {
  return randomUUID();
}
