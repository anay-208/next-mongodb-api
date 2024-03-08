function ObjectId(id: string) {
  return {
    $oid: id,
  };
}

interface Options {
  body: {
    filter?: object;
    projection?: object;
    sort?: object;
    limit?: number;
    document?: object;
    documents?: object[];
    update?: object;
    pipeline?: object;
  };
  headers?: object;
  method?: string;
  next?: object;
}

type FindOptions = {
  sort?: object,
  limit?: number
}

class MongoApi<T = object | object[]> {
  databaseName!: string;
  collectionName!: string;
  dataSource!: string;
  url!: string;
  private API_KEY!: string;
  options: Options = { body: {} };
  action!: string;
  requestOptions: object | null;
  Schema: object | undefined;

  constructor(
    {
      url,
      API_KEY,
      dataSource,
    }: { url: string; API_KEY: string; dataSource: string },
    requestOptions: object = {}
  ) {
    if (!url || !API_KEY || !dataSource)
      throw new Error("Missing required parameters.");
    if (!url.endsWith("/")) url += "/";
    this.API_KEY = API_KEY;
    this.url = url;
    this.dataSource = dataSource;
    this.requestOptions = requestOptions;
  }

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
    const json = (await response.json()) as { documents?: T[] };
    return json.documents ? json.documents : json;
  }

  db(databaseName: string) {
    this.databaseName = databaseName;
    return this;
  }

  collection<Schema = T>(collectionName: string) {
    this.collectionName = collectionName;
    return this as unknown as MongoApi<Schema>;
  }
/**
 * Find documents in the collection.
 * @param {object} filter - The filter criteria.
 * @param {object} projection - The projection criteria.
 * @param {FindOptions} options - The options for sorting and limiting the results.
 * @returns {Promise<T>} The found documents.
 */
async find(
  filter: object = {},
  projection: object = {},
  options: FindOptions = {}
): Promise<T[]> {
  this.action = "find";
  this.options = {
    method: "POST",
    body: {
      filter,
      projection,
      ...options,
    },
  };
  return await this.dispatchRequest(this.action, this.options) as T[];
}

  /**
   * Perform an aggregation pipeline operation.
   * @param {object[]} pipeline - The aggregation pipeline.
   * @returns {Promise<T>} The result of the operation.
   */
  async aggregate(pipeline: object[]) {
    this.action = "aggregate";
    this.options = {
      method: "POST",
      body: {
        pipeline,
      },
    };
    return await this.dispatchRequest(this.action, this.options);
  }

/**
 * Find many documents in the collection.
 * @param {object} filter - The filter criteria.
 * @param {object} projection - The projection criteria.
 * @param {FindOptions} options - The options for sorting and limiting the results.
 * @returns {Promise<T>} The found documents.
 */
async findMany(
  filter: object = {},
  projection: object = {},
  options: FindOptions = {}
) {
  this.action = "find";
  this.options = {
    method: "POST",
    body: {
      filter,
      projection,
      ...options,
    },
  };
  return await this.dispatchRequest(this.action, this.options);
}




/**
 * Insert one document into the collection.
 * @param {object} document - The document to insert.
 * @returns {Promise<object>} The result of the operation.
 */
async insertOne(document: object) {
  this.action = "insertOne";
  this.options = {
    method: "POST",
    body: {
      document,
    },
  };
  return await this.dispatchRequest(this.action, this.options);
}

/**
 * Insert many documents into the collection.
 * @param {object[]} documents - The documents to insert.
 * @returns {Promise<object>} The result of the operation.
 */
async insertMany(documents: object[]) {
  this.action = "insertMany";
  this.options = {
    method: "POST",
    body: {
      documents,
    },
  };
  return await this.dispatchRequest(this.action, this.options);
}

/**
 * Update one document in the collection.
 * @param {object} filter - The filter criteria.
 * @param {object} update - The update operations to be applied to the document.
 * @returns {Promise<object>} The result of the operation.
 */
async updateOne(filter: object, update: object) {
  this.action = "updateOne";
  this.options = {
    method: "POST",
    body: {
      filter,
      update,
    },
  };
  return await this.dispatchRequest(this.action, this.options);
}


  /**
   * Update many documents in the collection.
   * @param {object} filter - The filter criteria.
   * @param {object} update - The update operations to be applied to the documents.
   * @returns {Promise<object>} The result of the operation.
   */
  async updateMany(filter: object, update: object) {
    this.action = "updateMany";
    this.options = {
      method: "POST",
      body: {
        filter,
        update,
      },
    };
    return await this.dispatchRequest(this.action, this.options);
  }


  /**
   * Delete one document from the collection.
   * @param {object} filter - The filter criteria.
   * @returns {Promise<object>} The result of the operation.
   */
  async deleteOne(filter: object) {
    this.action = "deleteOne";
    this.options = {
      method: "POST",
      body: {
        filter,
      },
    };
    return await this.dispatchRequest(this.action, this.options);
  }

  /**
   * Delete many documents from the collection.
   * @param {object} filter - The filter criteria.
   * @returns {Promise<T>} The result of the operation.
   */
  async deleteMany(filter: object) {
    this.action = "deleteMany";
    this.options = {
      method: "POST",
      body: {
        filter,
      },
    };
    return await this.dispatchRequest(this.action, this.options);
  }



}

export default MongoApi; // for TypeScript and ES6
module.exports = MongoApi; // for CommonJS
export { ObjectId };
module.exports.ObjectId = ObjectId;