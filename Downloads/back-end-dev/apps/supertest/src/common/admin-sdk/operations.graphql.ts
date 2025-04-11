import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Admin = {
  __typename?: 'Admin';
  contacts: Array<AdminContact>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  roles: Array<Role>;
  sessions: Array<Session>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AdminContact = {
  __typename?: 'AdminContact';
  isMain: Scalars['Boolean']['output'];
  type: ContactType;
  value: Scalars['String']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AdminItem = {
  __typename?: 'AdminItem';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AdminsResponseDto = {
  __typename?: 'AdminsResponseDto';
  data: Array<AdminItem>;
  total: Scalars['Float']['output'];
};

export type ContactDto = {
  type: ContactType;
  value: Scalars['String']['input'];
};

export enum ContactType {
  Email = 'EMAIL',
  Phone = 'PHONE'
}

export type GetPlayersFilterDto = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type GetPlayersResponseDto = {
  __typename?: 'GetPlayersResponseDto';
  data: Array<Player>;
  total: Scalars['Int']['output'];
};

export enum Lang2 {
  Ar = 'AR',
  Bn = 'BN',
  De = 'DE',
  En = 'EN',
  Es = 'ES',
  Fa = 'FA',
  Fr = 'FR',
  Hi = 'HI',
  It = 'IT',
  Ja = 'JA',
  Ko = 'KO',
  Nl = 'NL',
  Pl = 'PL',
  Pt = 'PT',
  Ru = 'RU',
  Th = 'TH',
  Tr = 'TR',
  Uk = 'UK',
  Vi = 'VI',
  Zh = 'ZH'
}

export type LoginDto = {
  contact: ContactDto;
  password: Scalars['String']['input'];
};

export type LoginResponseDto = {
  __typename?: 'LoginResponseDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponseDto;
  refreshAccessToken: LoginResponseDto;
  register: LoginResponseDto;
};


export type MutationLoginArgs = {
  dto: LoginDto;
};


export type MutationRegisterArgs = {
  dto: RegisterDto;
};

export type PaginationDto = {
  limit?: Scalars['Float']['input'];
  page?: Scalars['Float']['input'];
};

export enum PermissionName {
  AdminDelete = 'ADMIN_DELETE',
  AdminRead = 'ADMIN_READ',
  AdminWrite = 'ADMIN_WRITE',
  PermissionDelete = 'PERMISSION_DELETE',
  PermissionRead = 'PERMISSION_READ',
  PermissionWrite = 'PERMISSION_WRITE',
  PlayerDelete = 'PLAYER_DELETE',
  PlayerRead = 'PLAYER_READ',
  PlayerWrite = 'PLAYER_WRITE',
  RoleDelete = 'ROLE_DELETE',
  RoleRead = 'ROLE_READ',
  RoleWrite = 'ROLE_WRITE'
}

export type Player = {
  __typename?: 'Player';
  contacts: Array<PlayerContact>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  info?: Maybe<PlayerInfo>;
  isActive: Scalars['Boolean']['output'];
  lang2: Lang2;
  normalizedUsername: Scalars['String']['output'];
  roles: Array<Role>;
  sessions: Array<Session>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type PlayerContact = {
  __typename?: 'PlayerContact';
  isMain: Scalars['Boolean']['output'];
  type: ContactType;
  value: Scalars['String']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PlayerInfo = {
  __typename?: 'PlayerInfo';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  countryCode: Scalars['String']['output'];
  dateOfBirth: Scalars['DateTime']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  middleName?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  admin?: Maybe<Admin>;
  admins: AdminsResponseDto;
  players: GetPlayersResponseDto;
  role: Role;
  roles: Array<Role>;
  sessions: Array<Session>;
};


export type QueryAdminArgs = {
  id: Scalars['String']['input'];
};


export type QueryPlayersArgs = {
  filter?: InputMaybe<GetPlayersFilterDto>;
  pagination?: InputMaybe<PaginationDto>;
};


export type QueryRoleArgs = {
  id: Scalars['ID']['input'];
};

export type RegisterDto = {
  contact: ContactDto;
  password: Scalars['String']['input'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  permissions: Array<PermissionName>;
};

export type Session = {
  __typename?: 'Session';
  expiresAt: Scalars['DateTime']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  sessionId: Scalars['String']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type LoginMutationVariables = Exact<{
  dto: LoginDto;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponseDto', accessToken: string, refreshToken: string } };

export type RegisterMutationVariables = Exact<{
  dto: RegisterDto;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'LoginResponseDto', accessToken: string, refreshToken: string } };

export type PlayersQueryVariables = Exact<{ [key: string]: never; }>;


export type PlayersQuery = { __typename?: 'Query', players: { __typename?: 'GetPlayersResponseDto', total: number, data: Array<{ __typename?: 'Player', id: string, normalizedUsername: string, username: string, lang2: Lang2, isActive: boolean, roles: Array<{ __typename?: 'Role', name: string }>, info?: { __typename?: 'PlayerInfo', id: string, firstName: string, lastName: string, middleName?: string | null, dateOfBirth: any, address: string, countryCode: string, city: string } | null, contacts: Array<{ __typename?: 'PlayerContact', type: ContactType, value: string, isMain: boolean, verifiedAt?: any | null }> }> } };

export type AdminQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type AdminQuery = { __typename?: 'Query', admin?: { __typename?: 'Admin', id: string, isActive: boolean, roles: Array<{ __typename?: 'Role', id: number, name: string }> } | null };

export type AdminsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminsQuery = { __typename?: 'Query', admins: { __typename?: 'AdminsResponseDto', total: number, data: Array<{ __typename?: 'AdminItem', id: string, isActive: boolean, createdAt: any, updatedAt: any }> } };

export type RolesQueryVariables = Exact<{ [key: string]: never; }>;


export type RolesQuery = { __typename?: 'Query', roles: Array<{ __typename?: 'Role', id: number, name: string }> };

export type RefreshAccessTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshAccessTokenMutation = { __typename?: 'Mutation', refreshAccessToken: { __typename?: 'LoginResponseDto', accessToken: string, refreshToken: string } };


export const LoginDocument = gql`
    mutation Login($dto: LoginDto!) {
  login(dto: $dto) {
    accessToken
    refreshToken
  }
}
    `;
export const RegisterDocument = gql`
    mutation Register($dto: RegisterDto!) {
  register(dto: $dto) {
    accessToken
    refreshToken
  }
}
    `;
export const PlayersDocument = gql`
    query Players {
  players {
    total
    data {
      id
      normalizedUsername
      username
      lang2
      isActive
      roles {
        name
      }
      info {
        id
        firstName
        lastName
        middleName
        dateOfBirth
        address
        countryCode
        city
      }
      contacts {
        type
        value
        isMain
        verifiedAt
      }
    }
  }
}
    `;
export const AdminDocument = gql`
    query Admin($id: String!) {
  admin(id: $id) {
    id
    isActive
    roles {
      id
      name
    }
  }
}
    `;
export const AdminsDocument = gql`
    query Admins {
  admins {
    total
    data {
      id
      isActive
      createdAt
      updatedAt
    }
  }
}
    `;
export const RolesDocument = gql`
    query Roles {
  roles {
    id
    name
  }
}
    `;
export const RefreshAccessTokenDocument = gql`
    mutation RefreshAccessToken {
  refreshAccessToken {
    accessToken
    refreshToken
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Login(variables: LoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginMutation>(LoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Login', 'mutation', variables);
    },
    Register(variables: RegisterMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RegisterMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegisterMutation>(RegisterDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Register', 'mutation', variables);
    },
    Players(variables?: PlayersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PlayersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PlayersQuery>(PlayersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Players', 'query', variables);
    },
    Admin(variables: AdminQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AdminQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AdminQuery>(AdminDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Admin', 'query', variables);
    },
    Admins(variables?: AdminsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AdminsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AdminsQuery>(AdminsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Admins', 'query', variables);
    },
    Roles(variables?: RolesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RolesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RolesQuery>(RolesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Roles', 'query', variables);
    },
    RefreshAccessToken(variables?: RefreshAccessTokenMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RefreshAccessTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RefreshAccessTokenMutation>(RefreshAccessTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RefreshAccessToken', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;