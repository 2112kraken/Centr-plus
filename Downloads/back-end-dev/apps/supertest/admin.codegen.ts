import { CodegenConfig } from '@graphql-codegen/cli';
import { join } from 'node:path';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  generates: {
    [join(__dirname, './src/common/admin-sdk/operations.graphql.ts')]: {
      documents: join(__dirname, './src/common/admin-sdk/scheme.graphql'),
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
    },
  },
};

export default config;
