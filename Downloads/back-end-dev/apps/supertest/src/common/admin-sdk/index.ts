import { GraphQLClient } from 'graphql-request';

import { getSdk } from '@supertest/common/admin-sdk/operations.graphql';
import { config } from '@supertest/config';

const { host, port } = config.service.adminpanel.graphql;

const client = new GraphQLClient(`http://${host}:${port}/graphql`);
export const adminSdk = getSdk(client);
