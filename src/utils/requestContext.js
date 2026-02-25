const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

class RequestContext {
  static getRequestId() {
    const store = asyncLocalStorage.getStore();
    return store?.requestId;
  }

  static setRequestId(requestId) {
    const store = asyncLocalStorage.getStore() || {};
    store.requestId = requestId;
    return store;
  }

  static run(requestId, callback) {
    return asyncLocalStorage.run({ requestId }, callback);
  }
}

module.exports = { RequestContext, asyncLocalStorage };
