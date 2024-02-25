# MongoApi

This is a TypeScript module that provides a simple interface for interacting with MongoDB. It is ideal for serverless applications, and made especially for next.js.

## Installation

```bash
npm install next-mongodb-api
```

## Usage

Enable the data api at mongodb cluster

First, import the `MongoApi` and `ObjectId` classes:

```typescript
import MongoApi, { ObjectId } from 'next-mongodb-api';
```

Then, create a new `MongoApi` instance:

```typescript
const client = new MongoApi({url: 'your_url', API_KEY: 'your_api_key', dataSource: 'your_data_source'}, {next: {revalidate: 300}});
const db = client.db("myDatabase")

```

You can use the `next` to pass values to 
```typescript 
fetch(url, {  /*object is passed here along with other values*/})
```

If you use nextjs, it's highly recommended to add the `revalidate` attribute like this.
You can then use the `MongoApi` instance to interact with your MongoDB database. Here are some examples:

```typescript
// Define a type for your collection
type Collection = {
  name: string,
  number: number
}

const collection = db.collection<Collection>("myCollection")


// Find documents
collection.find({ name: 'John' });

// Find documents and sort and limit
collection.find({ name: 'John' }, {}, { limit: 1 });

// Insert a document
collection.insertOne({ name: 'John', age: 30 });

// Update a document
collection.updateOne({ name: 'John' }, { $set: { age: 31 } });

// Delete a document
collection.deleteOne({ name: 'John' });

// Aggregate documents
collection.aggregate([{ $match: { age: { $gt: 20 } } }]);
```

If you'd like more methods, just create an issue, and I'll add it within 24 hours!

## API

The `MongoApi` class has the following methods:

- `constructor({url: string, API_KEY: string, dataSource: string}, requestOptions: object)`: Creates a new `MongoApi` instance.
- `db(databaseName: string)`: Sets the database to use for the MongoDB operations.
- `collection<Schema = T>(collectionName: string)`: Sets the collection to use for the MongoDB operations.
- `find(filter: object = {}, projection: object = {}, options: FindOptions = {})`: Sets up a find operation.
- `findMany(filter: object = {}, projection: object = {}, options: FindOptions = {})`: Sets up a findMany operation. 
- `updateMany(filter: object, update: object)`: Sets up an updateMany operation. This 
- `deleteMany(filter: object)`: Sets up a deleteMany operation. 
- `insertOne(document: object)`: Sets up an insertOne operation.
- `insertMany(documents: object[])`: Sets up an insertMany operation.
- `updateOne(filter: object, update: object)`: Sets up an updateOne operation.
- `deleteOne(filter: object)`: Sets up a deleteOne operation.
- `aggregate(pipeline: object[])`: Sets up an aggregate operation.

The `ObjectId` function creates an ObjectId object:

- `ObjectId(id: string)`: Creates an ObjectId object.

## License

MIT