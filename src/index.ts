
function ObjectId(id : string){
  return {
    "$oid": id
  }
}




interface Options {
  body: {
      filter?: object;
      projection?: object;
      sort?: object;
      limit?: object;
      document?: object;
      update?: object;
      pipeline?: object;
  };
  headers?: object;
  method?: string;
  next?: object;
} 
class MongoApi {
  databaseName!: string;
  collectionName!: string;
  dataSource!: string;
  url!: string;
  private API_KEY!: string;
  options: Options = {body: {}};
  action!: string;
  requestOptions: object | null;

  /**
 * The constructor for the MongoApi class.
 * @param url - The base URL for the MongoDB API.
 * @param API_KEY - The API key for the MongoDB API.
 * @param dataSource - The data source for the MongoDB API.
 * @param requestOptions - if you are using next.js, its highly recommend to add next: {revalidate: 300} as the value.
 */
  constructor(url: string, API_KEY: string, dataSource: string, requestOptions: object = {}) {
    if(!url || !API_KEY || !dataSource) throw new Error("Missing required parameters.");
    if (!url.endsWith("/")) url += "/";
    this.API_KEY = API_KEY;
    this.url = url;
    this.dataSource = dataSource;
    this.requestOptions = requestOptions;
  }
/**
 * Dispatches a request to the MongoDB API.
 * @param action - The MongoDB operation to perform.
 * @param options - The options for the MongoDB operation.
 * @returns The documents returned by the MongoDB operation.
 */
   async dispatchRequest(action: string, options: Options) {
    if (!this.databaseName || !this.collectionName || !this.dataSource)
      throw new Error("Database or collection not specified.");
    const response = await fetch(this.url + action, {
      ...options,
      ...this.requestOptions,
      body: JSON.stringify({
        dataSource: this.dataSource,
        database: this.databaseName,
        collection: this.collectionName,
        ...options.body,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        apiKey: this.API_KEY,
        ...options.headers,
      },
    });
    const json = await response.json() as { documents?: object | object[] };
        return json.documents ? json.documents : json;
  }

/**
 * Sets the database to use for the MongoDB operations.
 * @param databaseName - The name of the database.
 * @returns The MongoApi instance.
 */
   db(databaseName: string) {
    this.databaseName = databaseName;
    return this;
  }
/**
 * Sets the collection to use for the MongoDB operations.
 * @param collectionName - The name of the collection.
 * @returns The MongoApi instance.
 */
   collection(collectionName: string) {
    this.collectionName = collectionName;
    return this;
  }


  /**
 * Sets the sort options for the find operation.
 * @param options - The sort options.
 * @returns The MongoApi instance.
 */
   sort(options: object) {
      this.options.body.sort = options;
      return this;
  }

  /**
 * Sets the limit for the find operation.
 * @param options - The limit.
 * @returns The MongoApi instance.
 */
  limit(options: object) {
      this.options.body.limit = options;
      return this;
  }

/**
 * Executes the MongoDB operation.
 * @returns The documents returned by the MongoDB operation.
 */
  async exec(){
    if(!this.action || !this.options) throw new Error("No action specified. Use find() or insertOne() or insertMany() or updateOne() or updateMany() or deleteOne() or deleteMany() or count() or aggregate() methods.")
    const { action, options } = this;
  this.action = "";
  this.options = {body: {}};
  const response = await this.dispatchRequest(action, options);
  return response;
  }

/**
 * Sets up a find operation.
 * @param filter - The filter for the find operation.
 * @param projection - The projection for the find operation.
 * @returns The MongoApi instance.
 */
  find(filter : object ={}, projection : object = {}) {
    this.action = "find";
    this.options = {
      method: "POST",
      body: {
        filter,
        projection,
      },
    }
    return this;
  }
/**
 * Sets up an insertOne operation.
 * @param document - The document to insert.
 * @returns The MongoApi instance.
 */
  insertOne(document: object) {
    this.action = "insertOne";
    this.options = {
      method: "POST",
      body: {
        document,
      },
    }
    return this;
  }

/**
 * Sets up an updateOne operation.
 * @param filter - The filter to select the document to update.
 * @param update - The update to apply to the document.
 * @returns The MongoApi instance.
 */
  updateOne(filter: object, update: object) {
    this.action = "updateOne";
    this.options = {
      method: "POST",
      body: {
        filter,
        update,
      },
    }
    return this;
  }

/**
 * Sets up a deleteOne operation.
 * @param filter - The filter to select the document to delete.
 * @returns The MongoApi instance.
 */
  deleteOne(filter: object) {
    this.action = "deleteOne";
    this.options = {
      method: "POST",
      body: {
        filter,
      },
    }
    return this;
  }
  
  /**
   * Sets up an aggregate operation.
   * @param pipeline - The aggregation pipeline.
   * @returns The MongoApi instance.
   */
aggregate(pipeline: object[]) {
  this.action = "aggregate";
  this.options = {
    method: "POST",
    body: {
      pipeline,
    },
  }
  return this;
}


/**
 * Sets up a findMany operation.
 * @param filter - The filter for the find operation.
 * @param projection - The projection for the find operation.
 * @returns The MongoApi instance.
 */
findMany(filter : object ={}, projection : object = {}) {
  this.action = "find";
  this.options = {
    method: "POST",
    body: {
      filter,
      projection,
    },
  }
  return this;
}

/**
 * Sets up an updateMany operation.
 * @param filter - The filter to select the documents to update.
 * @param update - The update to apply to the documents.
 * @returns The MongoApi instance.
 */
updateMany(filter: object, update: object) {
  this.action = "updateMany";
  this.options = {
    method: "POST",
    body: {
      filter,
      update,
    },
  }
  return this;
}

/**
 * Sets up a deleteMany operation.
 * @param filter - The filter to select the documents to delete.
 * @returns The MongoApi instance.
 */
deleteMany(filter: object) {
  this.action = "deleteMany";
  this.options = {
    method: "POST",
    body: {
      filter,
    },
  }
  return this;
}

/**
 * Sets up a findOneAndUpdate operation.
 * @param filter - The filter to select the document to update.
 * @param update - The update to apply to the document.
 * @returns The original document before it was updated.
 */

}

export default MongoApi; // for TypeScript and ES6
module.exports = MongoApi; // for CommonJS
export { ObjectId}
module.exports.ObjectId = ObjectId; 