/**
 * Generate random integer ID within range
 */
export function generateRandomId(min: number, max: number): string {
  const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomInt.toString();
}

/**
 * Generate random username and email
 */
export function generateTestUser() {
  const username = Date.now() + generateRandomId(1000, 9999);
  return {
    username,
    email: `${username}@test.com`,
  };
}
