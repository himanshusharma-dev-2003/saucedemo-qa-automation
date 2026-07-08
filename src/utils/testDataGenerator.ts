import { configureFaker, faker } from '../test-data/generator';
import { 
  generateUser, 
  generateUsers, 
  generateCompany,
  generateEmail,
  generatePassword,
  generateUsername
} from '../test-data/users';
import { generateAddress, generatePhone } from '../test-data/addresses';

// Initialize Faker config (checks process.env for deterministic seed)
configureFaker();

/**
 * Facade class that provides a centralized interface for generating all test data.
 * It combines all the sub-generators and provides convenient methods.
 */
export class TestDataGenerator {
  
  static generateUser() {
    const user = generateUser();
    this.logGeneratedData('User', {
      Name: user.fullName,
      Email: user.email,
      Phone: user.phone,
    });
    return user;
  }

  static generateUsers(count: number) {
    return generateUsers(count);
  }

  static generateAddress() {
    return generateAddress();
  }

  static generateCompany() {
    return generateCompany();
  }

  static generateEmail(firstName: string = faker.person.firstName(), lastName: string = faker.person.lastName()) {
    return generateEmail(firstName, lastName);
  }

  static generatePassword() {
    return generatePassword();
  }

  static generateUsername(firstName: string = faker.person.firstName(), lastName: string = faker.person.lastName()) {
    return generateUsername(firstName, lastName);
  }

  static generatePhone() {
    return generatePhone();
  }

  static generateUUID() {
    return faker.string.uuid();
  }

  static generateRandomString(length: number = 10) {
    return faker.string.alphanumeric(length);
  }

  static generateFutureDate() {
    return faker.date.future();
  }

  static generateRandomNumber(min: number = 0, max: number = 1000) {
    return faker.number.int({ min, max });
  }

  static generateOrderId() {
    return `ORD-${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`;
  }

  static generateBookingId() {
    return `BKG-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`;
  }

  /**
   * Helper to log generated data for debugging and reporting purposes.
   */
  private static logGeneratedData(type: string, data: Record<string, string>) {
    console.log(`\n--- Generated ${type} ---`);
    Object.entries(data).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.log('------------------------\n');
  }
}
