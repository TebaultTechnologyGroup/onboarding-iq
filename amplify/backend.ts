import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { mapData } from './functions/map-data/resource';
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
  mapData
});

const MODEL_ID = "us.anthropic.claude-haiku-4-5-20251001-v1:0";


backend.mapData.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'bedrock:InvokeModel',
      'bedrock:InvokeModelWithResponseStream',
      'aws-marketplace:ViewSubscriptions',
      'aws-marketplace:Subscribe',
    ],
    resources: ['*'],
  })
);
