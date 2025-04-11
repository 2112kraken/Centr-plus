import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export const xmlParser = new XMLParser({
  attributeNamePrefix: '@',
  ignoreAttributes: false,
});

export const xmlBuilder = new XMLBuilder({
  attributeNamePrefix: '@',
  ignoreAttributes: false,
});

export const XML = {
  parse: (xml: string) => xmlParser.parse(xml),
  stringify: (obj: Record<string, any>) => xmlBuilder.build(obj),
};
