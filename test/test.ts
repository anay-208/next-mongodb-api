require("dotenv").config();
const MongoApi = require("next-mongodb-api");
const {ObjectId} = require("next-mongodb-api")

const client = new MongoApi(
  process.env.MONGODB_API_ENDPOINT,
  process.env.MONGODB_API_KEY,
  "Sharlz"
);

async function main() {
  const db =  client.db("admins");
    const data = await db.collection("users").find({_id: ObjectId("656a1ac0ad868f2b83dfb585")}).exec();
    console.log(data)
}

main();
