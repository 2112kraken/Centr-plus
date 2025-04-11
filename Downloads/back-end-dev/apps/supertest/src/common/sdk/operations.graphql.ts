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

export type ContactBeginConfirmationDto = {
  contact: ContactInput;
};

export type ContactDto = {
  type: ContactType;
  value: Scalars['String']['input'];
};

export type ContactFinishConfirmationDto = {
  contact: ContactInput;
  token: Scalars['String']['input'];
};

export type ContactInput = {
  id: Scalars['String']['input'];
};

export enum ContactType {
  Email = 'EMAIL',
  Phone = 'PHONE'
}

export enum CurrencyCode {
  Ada = 'ADA',
  Algo = 'ALGO',
  Atom = 'ATOM',
  Aud = 'AUD',
  Avax = 'AVAX',
  Bch = 'BCH',
  Bnb = 'BNB',
  Btc = 'BTC',
  Cad = 'CAD',
  Chf = 'CHF',
  Cny = 'CNY',
  Dai = 'DAI',
  Doge = 'DOGE',
  Dot = 'DOT',
  Etc = 'ETC',
  Eth = 'ETH',
  Eur = 'EUR',
  Fil = 'FIL',
  Gbp = 'GBP',
  Hkd = 'HKD',
  Jpy = 'JPY',
  Link = 'LINK',
  Ltc = 'LTC',
  Mana = 'MANA',
  Matic = 'MATIC',
  Near = 'NEAR',
  Nzd = 'NZD',
  Sand = 'SAND',
  Shib = 'SHIB',
  Sol = 'SOL',
  Trx = 'TRX',
  Uni = 'UNI',
  Usd = 'USD',
  Usdc = 'USDC',
  Usdt = 'USDT',
  Vet = 'VET',
  Xlm = 'XLM',
  Xmr = 'XMR',
  Xrp = 'XRP',
  Xtz = 'XTZ'
}

export type LaunchGameDto = {
  accountCurrencyCode: CurrencyCode;
  gameCode: Scalars['String']['input'];
  gameCurrencyCode: CurrencyCode;
};

export type LoginContactDto = {
  type: ContactType;
  value: Scalars['String']['input'];
};

export type LoginDto = {
  contact: LoginContactDto;
  password: Scalars['String']['input'];
};

export type LoginResponseDto = {
  __typename?: 'LoginResponseDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: Player;
};

export type Mutation = {
  __typename?: 'Mutation';
  beginContactConfirmation: TempTokenResponseDto;
  beginResetPassword: TempTokenResponseDto;
  finishContactConfirmation: PlayerContact;
  finishResetPassword: LoginResponseDto;
  launchGame: Scalars['String']['output'];
  login: LoginResponseDto;
  refreshAccessToken: LoginResponseDto;
  register: LoginResponseDto;
  setPlayerInfo: PlayerInfo;
};


export type MutationBeginContactConfirmationArgs = {
  dto: ContactBeginConfirmationDto;
};


export type MutationBeginResetPasswordArgs = {
  dto: PasswordBeginResetDto;
};


export type MutationFinishContactConfirmationArgs = {
  dto: ContactFinishConfirmationDto;
};


export type MutationFinishResetPasswordArgs = {
  dto: PasswordFinishResetDto;
};


export type MutationLaunchGameArgs = {
  dto: LaunchGameDto;
};


export type MutationLoginArgs = {
  dto: LoginDto;
};


export type MutationRegisterArgs = {
  dto: RegisterDto;
};


export type MutationSetPlayerInfoArgs = {
  dto: SetPlayerInfoDto;
};

export type PasswordBeginResetDto = {
  contact: ContactDto;
  twoFactorCode?: InputMaybe<Scalars['String']['input']>;
};

export type PasswordFinishResetDto = {
  contact: ContactDto;
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
  twoFactorCode?: InputMaybe<Scalars['String']['input']>;
};

export type Player = {
  __typename?: 'Player';
  contacts: Array<PlayerContact>;
  id: Scalars['ID']['output'];
  info?: Maybe<PlayerInfo>;
  lang2: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type PlayerContact = {
  __typename?: 'PlayerContact';
  id: Scalars['ID']['output'];
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
  lastName: Scalars['String']['output'];
  middleName?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  pingGames: Scalars['String']['output'];
  pingGamification: Scalars['String']['output'];
  pingPsp: Scalars['String']['output'];
  pingScheduler: Scalars['String']['output'];
  pingStats: Scalars['String']['output'];
  player: Player;
};

export type RegisterDto = {
  contact: ContactDto;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Session = {
  __typename?: 'Session';
  expiresAt: Scalars['DateTime']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  sessionId: Scalars['String']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type SetPlayerInfoDto = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  countryCode?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
};

export type TempTokenResponseDto = {
  __typename?: 'TempTokenResponseDto';
  expireAt: Scalars['Float']['output'];
};

export type RegisterMutationVariables = Exact<{
  dto: RegisterDto;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'LoginResponseDto', accessToken: string, refreshToken: string, user: { __typename?: 'Player', id: string, lang2: string, username: string, contacts: Array<{ __typename?: 'PlayerContact', id: string, type: ContactType, value: string, isMain: boolean, verifiedAt?: any | null }>, info?: { __typename?: 'PlayerInfo', firstName: string, middleName?: string | null, lastName: string, dateOfBirth: any, address: string, countryCode: string, city: string } | null } } };

export type LoginMutationVariables = Exact<{
  dto: LoginDto;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponseDto', accessToken: string, refreshToken: string, user: { __typename?: 'Player', id: string, lang2: string, username: string, contacts: Array<{ __typename?: 'PlayerContact', id: string, type: ContactType, value: string, isMain: boolean, verifiedAt?: any | null }>, info?: { __typename?: 'PlayerInfo', firstName: string, middleName?: string | null, lastName: string, dateOfBirth: any, address: string, countryCode: string, city: string } | null } } };

export type SetPlayerInfoMutationVariables = Exact<{
  dto: SetPlayerInfoDto;
}>;


export type SetPlayerInfoMutation = { __typename?: 'Mutation', setPlayerInfo: { __typename?: 'PlayerInfo', firstName: string, middleName?: string | null, lastName: string, dateOfBirth: any, address: string, countryCode: string, city: string } };

export type PlayerQueryVariables = Exact<{ [key: string]: never; }>;


export type PlayerQuery = { __typename?: 'Query', player: { __typename?: 'Player', id: string, lang2: string, username: string, contacts: Array<{ __typename?: 'PlayerContact', id: string, type: ContactType, value: string, isMain: boolean, verifiedAt?: any | null }>, info?: { __typename?: 'PlayerInfo', firstName: string, middleName?: string | null, lastName: string, dateOfBirth: any, address: string, countryCode: string, city: string } | null } };

export type RefreshAccessTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshAccessTokenMutation = { __typename?: 'Mutation', refreshAccessToken: { __typename?: 'LoginResponseDto', accessToken: string, refreshToken: string, user: { __typename?: 'Player', id: string, lang2: string, username: string, contacts: Array<{ __typename?: 'PlayerContact', id: string, type: ContactType, value: string, isMain: boolean, verifiedAt?: any | null }>, info?: { __typename?: 'PlayerInfo', firstName: string, middleName?: string | null, lastName: string, dateOfBirth: any, address: string, countryCode: string, city: string } | null } } };

export type BeginContactConfirmationMutationVariables = Exact<{
  dto: ContactBeginConfirmationDto;
}>;


export type BeginContactConfirmationMutation = { __typename?: 'Mutation', beginContactConfirmation: { __typename?: 'TempTokenResponseDto', expireAt: number } };

export type FinishContactConfirmationMutationVariables = Exact<{
  dto: ContactFinishConfirmationDto;
}>;


export type FinishContactConfirmationMutation = { __typename?: 'Mutation', finishContactConfirmation: { __typename?: 'PlayerContact', id: string, type: ContactType, value: string, isMain: boolean, verifiedAt?: any | null } };

export type LaunchGameMutationVariables = Exact<{
  dto: LaunchGameDto;
}>;


export type LaunchGameMutation = { __typename?: 'Mutation', launchGame: string };


export const RegisterDocument = gql`
    mutation Register($dto: RegisterDto!) {
  register(dto: $dto) {
    accessToken
    refreshToken
    user {
      id
      lang2
      username
      contacts {
        id
        type
        value
        isMain
        verifiedAt
      }
      info {
        firstName
        middleName
        lastName
        dateOfBirth
        address
        countryCode
        city
      }
    }
  }
}
    `;
export const LoginDocument = gql`
    mutation Login($dto: LoginDto!) {
  login(dto: $dto) {
    accessToken
    refreshToken
    user {
      id
      lang2
      username
      contacts {
        id
        type
        value
        isMain
        verifiedAt
      }
      info {
        firstName
        middleName
        lastName
        dateOfBirth
        address
        countryCode
        city
      }
    }
  }
}
    `;
export const SetPlayerInfoDocument = gql`
    mutation SetPlayerInfo($dto: SetPlayerInfoDto!) {
  setPlayerInfo(dto: $dto) {
    firstName
    middleName
    lastName
    dateOfBirth
    address
    countryCode
    city
  }
}
    `;
export const PlayerDocument = gql`
    query Player {
  player {
    id
    lang2
    username
    contacts {
      id
      type
      value
      isMain
      verifiedAt
    }
    info {
      firstName
      middleName
      lastName
      dateOfBirth
      address
      countryCode
      city
    }
  }
}
    `;
export const RefreshAccessTokenDocument = gql`
    mutation RefreshAccessToken {
  refreshAccessToken {
    accessToken
    refreshToken
    user {
      id
      lang2
      username
      contacts {
        id
        type
        value
        isMain
        verifiedAt
      }
      info {
        firstName
        middleName
        lastName
        dateOfBirth
        address
        countryCode
        city
      }
    }
  }
}
    `;
export const BeginContactConfirmationDocument = gql`
    mutation BeginContactConfirmation($dto: ContactBeginConfirmationDto!) {
  beginContactConfirmation(dto: $dto) {
    expireAt
  }
}
    `;
export const FinishContactConfirmationDocument = gql`
    mutation FinishContactConfirmation($dto: ContactFinishConfirmationDto!) {
  finishContactConfirmation(dto: $dto) {
    id
    type
    value
    isMain
    verifiedAt
  }
}
    `;
export const LaunchGameDocument = gql`
    mutation LaunchGame($dto: LaunchGameDto!) {
  launchGame(dto: $dto)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Register(variables: RegisterMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RegisterMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegisterMutation>(RegisterDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Register', 'mutation', variables);
    },
    Login(variables: LoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginMutation>(LoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Login', 'mutation', variables);
    },
    SetPlayerInfo(variables: SetPlayerInfoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SetPlayerInfoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetPlayerInfoMutation>(SetPlayerInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SetPlayerInfo', 'mutation', variables);
    },
    Player(variables?: PlayerQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PlayerQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PlayerQuery>(PlayerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Player', 'query', variables);
    },
    RefreshAccessToken(variables?: RefreshAccessTokenMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RefreshAccessTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RefreshAccessTokenMutation>(RefreshAccessTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RefreshAccessToken', 'mutation', variables);
    },
    BeginContactConfirmation(variables: BeginContactConfirmationMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<BeginContactConfirmationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<BeginContactConfirmationMutation>(BeginContactConfirmationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'BeginContactConfirmation', 'mutation', variables);
    },
    FinishContactConfirmation(variables: FinishContactConfirmationMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<FinishContactConfirmationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<FinishContactConfirmationMutation>(FinishContactConfirmationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'FinishContactConfirmation', 'mutation', variables);
    },
    LaunchGame(variables: LaunchGameMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LaunchGameMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LaunchGameMutation>(LaunchGameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'LaunchGame', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;