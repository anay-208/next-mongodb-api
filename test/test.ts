require("dotenv").config();
const MongoApi = require("../src/index");

const client = new MongoApi(
  process.env.MONGODB_API_ENDPOINT,
  process.env.MONGODB_API_KEY,
  process.env.DATA_SOURCE
);

async function main() {
  console.time('dbFetch')
  const db =  client.db("admins");
    const data = await db.collection("users").findOne().exec();
    console.log(data)
    console.log("Success!")
    console.timeEnd("dbFetch")
}

main();
