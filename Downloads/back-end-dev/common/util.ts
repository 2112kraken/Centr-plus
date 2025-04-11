import { FastifyRequest } from 'fastify';

import { Lang2 } from '@common/enum/lang.enum';

interface HeaderData {
  userAgent: string;
  ipAddress: string;
  lang2: Lang2;
}

export const getHeaderData = (req: FastifyRequest): HeaderData => {
  const headers = req.headers;

  const userAgent = String(headers['user-agent'] || '');
  const ipAddress = String(headers['x-forwarded-for'] || '').toLowerCase();
  const language = String(headers['x-language'] || '');

  const isValidLang = Object.values(Lang2).includes(language.toUpperCase() as Lang2);

  return {
    userAgent,
    ipAddress,
    lang2: isValidLang ? (language as Lang2) : Lang2.EN,
  };
};
