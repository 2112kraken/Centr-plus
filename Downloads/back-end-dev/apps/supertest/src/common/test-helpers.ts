import { randomUUID } from 'crypto';

import { ContactType, PlayerInfo } from '@supertest/common/sdk/operations.graphql';

export const generateTestPlayer = () => {
  const username = randomUUID().replaceAll('-', '');

  return {
    password: 'qweQWE123',
    username: username,
    contact: {
      type: ContactType.Email,
      value: `${username}@example.com`,
    },
  };
};

export const generateTestAdmin = () => {
  const username = randomUUID().replaceAll('-', '');

  return {
    password: 'qweQWE123',
    contact: {
      type: ContactType.Email,
      value: `${username}@example.com`,
    },
  };
};

export const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
export const randomNum = () => Math.floor(Math.random() * 9999) + 1;
export const randomStrNum = () => String(randomNum());

export const generateTestPlayerInfo = (): PlayerInfo => {
  const firstNames = ['John', 'Mike', 'Tom', 'Alex', 'William'];
  const middleNames = ['Michael', 'James', 'David', 'Robert', 'Lee'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Davis'];
  const cities = ['Springfield', 'Boston', 'Chicago', 'Miami', 'Denver'];
  const streets = ['Elm Street', 'Oak Road', 'Main Street', 'Park Avenue', 'Lake Drive'];
  const countries = ['US', 'CA', 'GB', 'FR', 'DE'];

  return {
    firstName: random(firstNames),
    middleName: random(middleNames),
    lastName: random(lastNames),
    address: `${randomNum()} ${random(streets)}`,
    city: random(cities),
    countryCode: random(countries),
    dateOfBirth: new Date('1988-04-23').toISOString(),
  };
};

export function getPlayerIdFromAccessToken(accessToken: string) {
  const data = accessToken.split('.')[1];
  const buff = Buffer.from(data, 'base64');
  const text = buff.toString('utf-8');
  const json = JSON.parse(text);

  return json.sub;
}
