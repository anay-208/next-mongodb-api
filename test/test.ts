import "dotenv/config";
import MongoApi from '../src/index';

describe('MongoApi', () => {
  let client: MongoApi;
  beforeAll(async () => {


    client = new MongoApi({
      url: process.env.MONGODB_API_ENDPOINT as string,
      API_KEY: process.env.MONGODB_API_KEY as string,
      dataSource: process.env.DATA_SOURCE as string,
    });
  });
  
  
  it('should find 1 document', async () => {
    const db = client.db(process.env.DB_NAME as string)
    const collection = db.collection(process.env.COLLECTION_NAME as string);


    const data = await collection.find({}, {}, {limit: 1});
    expect(data?.[0]).toHaveProperty('_id');
  });
});