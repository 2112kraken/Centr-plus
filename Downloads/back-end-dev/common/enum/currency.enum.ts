import { registerEnumType } from '@nestjs/graphql';

export enum CurrencyType {
  FIAT = 'FIAT',
  CRYPTO = 'CRYPTO',
  INTERNAL = 'INTERNAL',
}

export enum CurrencyCode {
  // Top 10 FIAT currencies by global trading volume
  USD = 'USD', // US Dollar
  EUR = 'EUR', // Euro

  // Top 30 CRYPTO currencies by market cap
  BTC = 'BTC', // Bitcoin
  ETH = 'ETH', // Ethereum
  USDT = 'USDT', // Tether
  BNB = 'BNB', // Binance Coin
  SOL = 'SOL', // Solana
  XRP = 'XRP', // Ripple
  USDC = 'USDC', // USD Coin
  ADA = 'ADA', // Cardano
  AVAX = 'AVAX', // Avalanche
  DOGE = 'DOGE', // Dogecoin
  DOT = 'DOT', // Polkadot
  TRX = 'TRX', // TRON
  LINK = 'LINK', // Chainlink
  MATIC = 'MATIC', // Polygon
  UNI = 'UNI', // Uniswap
  SHIB = 'SHIB', // Shiba Inu
  LTC = 'LTC', // Litecoin
  DAI = 'DAI', // Dai
  BCH = 'BCH', // Bitcoin Cash
  ATOM = 'ATOM', // Cosmos
  XLM = 'XLM', // Stellar
  FIL = 'FIL', // Filecoin
  NEAR = 'NEAR', // NEAR Protocol
  VET = 'VET', // VeChain
  ALGO = 'ALGO', // Algorand
  XMR = 'XMR', // Monero
  ETC = 'ETC', // Ethereum Classic
  MANA = 'MANA', // Decentraland
  SAND = 'SAND', // The Sandbox
  XTZ = 'XTZ', // Tezos
}

registerEnumType(CurrencyType, {
  name: 'CurrencyType',
});

registerEnumType(CurrencyCode, {
  name: 'CurrencyCode',
});
