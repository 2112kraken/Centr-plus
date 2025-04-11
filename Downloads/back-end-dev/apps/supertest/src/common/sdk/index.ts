import { GraphQLClient } from 'graphql-request';

import { getSdk } from '@supertest/common/sdk/operations.graphql';
import { config } from '@supertest/config';

const { host, port } = config.service.gateway.graphql;

const client = new GraphQLClient(`http://${host}:${port}/graphql`);
export const sdk = getSdk(client);
