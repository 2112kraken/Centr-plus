import { registerEnumType } from '@nestjs/graphql';

export enum Lang2 {
  EN = 'EN', // English
  ES = 'ES', // Spanish
  ZH = 'ZH', // Chinese (Mandarin)
  HI = 'HI', // Hindi
  AR = 'AR', // Arabic
  BN = 'BN', // Bengali
  PT = 'PT', // Portuguese
  RU = 'RU', // Russian
  JA = 'JA', // Japanese
  DE = 'DE', // German
  FR = 'FR', // French
  UK = 'UK', // Ukrainian
  IT = 'IT', // Italian
  KO = 'KO', // Korean
  VI = 'VI', // Vietnamese
  TR = 'TR', // Turkish
  FA = 'FA', // Persian/Farsi
  PL = 'PL', // Polish
  NL = 'NL', // Dutch
  TH = 'TH', // Thai
}

registerEnumType(Lang2, { name: 'Lang2' });
