import { faker } from './generator';
import { User, Company } from './types';
import { generateAddress, generatePhone } from './addresses';

/**
 * Generates a company profile.
 */
export const generateCompany = (): Company => {
  return {
    name: faker.company.name(),
    catchPhrase: faker.company.catchPhrase(),
    bs: faker.company.buzzPhrase(),
  };
};

/**
 * Generates a guaranteed unique email address.
 */
export const generateEmail = (firstName: string, lastName: string): string => {
  return faker.internet.email({ firstName, lastName, provider: 'test.com' });
};

/**
 * Generates a secure password.
 */
export const generatePassword = (): string => {
  return faker.internet.password({ length: 12, memorable: false });
};

/**
 * Generates a random username.
 */
export const generateUsername = (firstName: string, lastName: string): string => {
  return faker.internet.username({ firstName, lastName });
};

/**
 * Generates a single complete random user.
 */
export const generateUser = (): User => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    username: generateUsername(firstName, lastName),
    password: generatePassword(),
    email: generateEmail(firstName, lastName),
    phone: generatePhone(),
    address: generateAddress(),
    company: generateCompany(),
    uuid: faker.string.uuid(),
    createdAt: faker.date.recent(),
  };
};

/**
 * Generates an array of multiple users.
 * @param count The number of users to generate
 */
export const generateUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(generateUser());
  }
  return users;
};
