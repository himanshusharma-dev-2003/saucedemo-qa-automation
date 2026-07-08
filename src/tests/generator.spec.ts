import { test, expect } from '@playwright/test';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { faker } from '../test-data/generator';

test.describe('Test Data Generator Unit Tests', () => {
  
  test('should generate a complete user with address and company', () => {
    const user = TestDataGenerator.generateUser();
    
    expect(user.firstName).toBeTruthy();
    expect(user.lastName).toBeTruthy();
    expect(user.email).toContain('@test.com');
    expect(user.address.city).toBeTruthy();
    expect(user.company.name).toBeTruthy();
    expect(user.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  test('should generate an array of N users', () => {
    const users = TestDataGenerator.generateUsers(5);
    expect(users.length).toBe(5);
    expect(users[0].email).not.toEqual(users[1].email);
  });

  test('should support deterministic seed generation', () => {
    // Save current state
    const currentState = faker.seed(12345);
    const user1 = TestDataGenerator.generateUser();
    
    faker.seed(12345);
    const user2 = TestDataGenerator.generateUser();
    
    expect(user1.email).toEqual(user2.email);
    expect(user1.uuid).toEqual(user2.uuid);

    // Reset faker to random state for other tests
    faker.seed();
  });

  test('should generate secure passwords and realistic phone numbers', () => {
    const password = TestDataGenerator.generatePassword();
    expect(password.length).toBeGreaterThanOrEqual(12);

    const phone = TestDataGenerator.generatePhone();
    expect(phone.length).toBeGreaterThanOrEqual(5);
  });
});
