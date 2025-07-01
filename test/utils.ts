import { User } from 'src/users/user.entity';

export const DEFAULT_TEST_EMAIL = 'test@example.com';
export const DEFAULT_TEST_PASSWORD = 'hashedassword';
export const DEFAULT_TEST_NAME = 'Test User';

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  email: DEFAULT_TEST_EMAIL,
  password: DEFAULT_TEST_PASSWORD,
  name: DEFAULT_TEST_NAME,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
