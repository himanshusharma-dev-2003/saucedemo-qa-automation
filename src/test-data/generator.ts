import { faker } from '@faker-js/faker';

/**
 * Configure Faker for deterministic or random runs.
 * If a seed is provided (e.g. from an env variable FAKER_SEED),
 * Faker will generate the exact same data every run.
 */
export const configureFaker = () => {
  const seed = process.env.FAKER_SEED;
  if (seed) {
    const seedValue = parseInt(seed, 10);
    faker.seed(seedValue);
    console.log(`🌱 Faker initialized with deterministic seed: ${seedValue}`);
  } else {
    // Faker generates randomly by default, but we can explicitly reset it
    faker.seed(); 
  }
};

// Expose the configured faker instance
export { faker };
