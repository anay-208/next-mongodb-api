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
const client = new MongoApi(url, API_KEY, dataSource, next);
const db = client.db("myDatabase")
```

you can use the `next` to pass values to 
```typescript 
fetch(url, { next: /*object is passed here*/})
```
By default, it has a revalidate of 300 seconds(5 mins).

You can then use the `MongoApi` instance to interact with your MongoDB database. Here are some examples:

```typescript
// Find documents
db.collection('myCollection').find({ name: 'John' }).exec();

// Insert a document
db.collection('myCollection').insertOne({ name: 'John', age: 30 }).exec();

// Update a document
db.collection('myCollection').updateOne({ name: 'John' }, { $set: { age: 31 } }).exec();

// Delete a document
db.collection('myCollection').deleteOne({ name: 'John' }).exec();

// Aggregate documents
db.collection('myCollection').aggregate([{ $match: { age: { $gt: 20 } } }]).exec();
```

If you'd like more methods, just create an issue, and I'll add it within 24 hours!

## API

The `MongoApi` class has the following methods:

- `constructor(url: string, API_KEY: string, dataSource: string, next: object)`: Creates a new `MongoApi` instance.
- `db(databaseName: string)`: Sets the database to use for the MongoDB operations.
- `collection(collectionName: string)`: Sets the collection to use for the MongoDB operations.
- `find(filter: object, projection: object)`: Sets up a find operation.
- `insertOne(document: object)`: Sets up an insertOne operation.
- `updateOne(filter: object, update: object)`: Sets up an updateOne operation.
- `deleteOne(filter: object)`: Sets up a deleteOne operation.
- `aggregate(pipeline: object[])`: Sets up an aggregate operation.
- `sort(options: object)`: Sets the sort options for the find operation.
- `limit(options: object)`: Sets the limit for the find operation.
- `exec()`: Executes the MongoDB operation.

The `ObjectId` function creates an ObjectId object:

- `ObjectId(id: string)`: Creates an ObjectId object.

## License

MIT