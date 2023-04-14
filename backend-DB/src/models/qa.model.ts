import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';

dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set');
}

const client = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

export const getQuestions = async () => {
  const params = {
    TableName: 'QAT'
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    return data.Items?.map((item) => {
      return {
        question: item.question,
        answer: item.answer,
        id : item.id
        
      };
    }
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};
    
  
