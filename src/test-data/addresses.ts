import { faker } from './generator';
import { Address } from './types';

/**
 * Generates a full random address object.
 */
export const generateAddress = (): Address => {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    postalCode: faker.location.zipCode(),
  };
};

/**
 * Generates a random phone number.
 */
export const generatePhone = (): string => {
  return faker.phone.number({ style: 'national' });
};
