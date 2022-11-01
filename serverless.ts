import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'ignite-vi-node-desafio-01-serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', "serverless-dynamodb-local", "serverless-offline"],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: ["*"]
      },
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: ["*"]
      }
    ]
  },
  package: { individually: false },
  functions: { 
    createTODO: {
      handler: "src/functions/createTODO.handler",
      events: [
        {
          http: {
            path: "todos/{userid}",
            method: "post",
            cors: true,
          }
        }
      ]
    },
    listTODO: {
      handler: "src/functions/listTODOS.handler",
      events: [
        {
          http: {
            path: "todos/{userid}",
            method: "get",
            cors: true,
          }
        }
      ]
    }
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      external: ["chrome-aws-lambda"],
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      }
    }
  },
  resources: {
    Resources: {
      dbCertificateUsers: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "todos",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
