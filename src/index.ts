function ObjectId(id: string) {
  return {
    $oid: id,
  };
}

interface Options<T extends object = object> {
  body: {
    filter?: T;
    projection?: object;
    sort?: object;
    limit?: number;
    document?: object;
    documents?: object[];
    update?: object;
    pipeline?: object;
    skip?: number;
  };
  headers?: object;
  method?: string;
  next?: object;
}

interface FindOptions {
  sort?: object;
  limit?: number;
  skip?: number;
}

interface InsertOne {
  insertedId: string;
}

interface InsertMany {
  insertedIds: string[];
}

interface Update {
  matchedCount: number;
  modifiedCount: number;
}

interface Delete {
  deletedCount: number;
}

class MongoApi<T extends object | undefined = object | object[]> {
  databaseName!: string;
  collectionName!: string;
  dataSource!: string;
  url!: string;
  private API_KEY!: string;
  requestOptions: Record<string, any> = {};

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
    if (!url.endsWith("action/")) url += "action/";
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
    return json.documents || json;
  }
  db(databaseName: string) {
    const newInstance = new MongoApi(
      {
        url: this.url,
        API_KEY: this.API_KEY,
        dataSource: this.dataSource,
      },
      this.requestOptions || {}
    );
    newInstance.databaseName = databaseName;
    return newInstance;
  }

  collection<Schema extends object | undefined = T>(collectionName: string) {
    const newInstance = new MongoApi(
      {
        url: this.url,
        API_KEY: this.API_KEY,
        dataSource: this.dataSource,
      },
      this.requestOptions || {}
    );
    newInstance.databaseName = this.databaseName;
    newInstance.collectionName = collectionName;
    return newInstance as unknown as MongoApi<Schema>;
  }
  /**
   * Find documents in the collection.
   * @param {T} filter - The filter criteria.
   * @param {object} projection - The projection criteria.
   * @param {FindOptions} options - The options for sorting and limiting the results.
   * @returns {Promise<T[]>} The found documents.
   */
  find(
    filter: Partial<Record<keyof T, object | T[keyof T]>>,
    projection: object = {},
    // Limit 0 is equivalent of setting nolimit
    options: FindOptions = { sort: {}}
  ): Promise<T[] | []> {
    const action =  "find";
    const reqOptions = {
      method: "POST",
      body: {
        filter,
        projection,
        ...options,
      },
    };
    // interface Options {
    //   body: {
    //     filter?: object;
    //     projection?: object;
    //     sort?: object;
    //     limit?: number;
    //     document?: object;
    //     documents?: object[];
    //     update?: object;
    //     pipeline?: object;
    //   };
    //   headers?: object;
    //   method?: string;
    //   next?: object;
    // }
    return this.dispatchRequest(action, reqOptions) as Promise<T[]>;
  }

  /**
   * Perform an aggregation pipeline operation.
   * @param {object[]} pipeline - The aggregation pipeline.
   * @returns {Promise<T>} The result of the operation.
   */
  aggregate(pipeline: object[]) {
    const action =  "aggregate";
    const reqOptions = {
      method: "POST",
      body: {
        pipeline,
      },
    };
    return  this.dispatchRequest(action, reqOptions) as Promise<T>; //TODO
  }

  /**
   * Insert one document into the collection.
   * @param {T} document - The document to insert.
   * @returns {Promise<InsertOne>} The result of the operation.
   */
  insertOne<T extends object>(document: T) {
    const action =  "insertOne";
    const reqOptions = {
      method: "POST",
      body: {
        document,
      },
    };
    return this.dispatchRequest(action, reqOptions) as Promise<InsertOne>;
  }

  /**
   * Insert many documents into the collection.
   * @param {T[]} documents - The documents to insert.
   * @returns {Promise<InsertMany>} The result of the operation.
   */
  insertMany<T extends object>(documents: T[] | [] ) {
    const action =  "insertMany";
    const reqOptions = {
      method: "POST",
      body: {
        documents,
      },
    };
    return  this.dispatchRequest(
      action,
      reqOptions
    ) as Promise<InsertMany>;
  }

  /**
   * Update one document in the collection.
   * @param {object} filter - The filter criteria.
   * @param {object} update - The update operations to be applied to the document.
   * @returns {Promise<Update>} The result of the operation.
   */
   updateOne(filter: object, update: object) {
    const action =  "updateOne";
    const reqOptions = {
      method: "POST",
      body: {
        filter,
        update,
      },
    };
    return  this.dispatchRequest(action, reqOptions) as Promise<Update>;
  }

  /**
   * Update many documents in the collection.
   * @param {object} filter - The filter criteria.
   * @param {object} update - The update operations to be applied to the documents.
   * @returns {Promise<Update>} The result of the operation.
   */
  updateMany(filter: object, update: object) {
    const action =  "updateMany";
    const reqOptions = {
      method: "POST",
      body: {
        filter,
        update,
      },
    };
    return this.dispatchRequest(action, reqOptions) as Promise<Update>;
  }

  /**
   * Delete one document from the collection.
   * @param {object} filter - The filter criteria.
   * @returns {Promise<Delete>} The result of the operation.
   */
   deleteOne(filter: object) {
    const action =  "deleteOne";
    const reqOptions = {
      method: "POST",
      body: {
        filter,
      },
    };
    return  this.dispatchRequest(action, reqOptions) as Promise<Delete>;
  }

  /**
   * Delete many documents from the collection.
   * @param {object} filter - The filter criteria.
   * @returns {Promise<T>} The result of the operation.
   */
  deleteMany(filter: object) {
    const action =  "deleteMany";
    const reqOptions = {
      method: "POST",
      body: {
        filter,
      },
    };
    return this.dispatchRequest(action, reqOptions) as Promise<Delete>;
  }
}

export default MongoApi;
export { ObjectId };
