import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { mapData } from '../functions/map-data/resource';

const schema = a.schema({
  Customer: a.model({
    accountName: a.string().required(),
    billingEmail: a.string(),
    mrr: a.float(),
    status: a.string(),
    notes: a.string()
  }).authorization(allow => [allow.publicApiKey()]),

  // This defines the AI Mapping Action
  transformData: a.query()
    .arguments({ prompt: a.string() })
    .returns(a.string())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(mapData))
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema, authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});

