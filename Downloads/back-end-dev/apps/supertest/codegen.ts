import { CodegenConfig } from '@graphql-codegen/cli';
import { join } from 'node:path';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  generates: {
    [join(__dirname, './src/common/sdk/operations.graphql.ts')]: {
      documents: join(__dirname, './src/common/sdk/scheme.graphql'),
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
    },
  },
};

export default config;
