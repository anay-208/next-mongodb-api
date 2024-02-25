require("dotenv").config();
import MongoApi from "../src/index";

const client = new MongoApi({
  url: process.env.MONGODB_API_ENDPOINT as string,
  API_KEY: process.env.MONGODB_API_KEY as string,
  dataSource: process.env.DATA_SOURCE as string
});

type Collection = {
  name: string,
  number: number,
}

async function main() {
  console.time('dbFetch')
  const db =  client.db("admins");
    const collection = await db.collection<Collection>("users")
    const data = await collection.find({}, {}, {limit: 1})
    console.log(data)
    console.log("Success!")
    console.timeEnd("dbFetch")
}

main();
