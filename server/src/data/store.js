const crypto = require("crypto");
const { seedData } = require("./seed");

const collections = Object.keys(seedData);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createStore() {
  let db = clone(seedData);

  function ensureCollection(name) {
    if (!db[name]) {
      db[name] = [];
    }

    return db[name];
  }

  return {
    reset() {
      db = clone(seedData);
    },
    list(name) {
      return clone(ensureCollection(name));
    },
    findById(name, id) {
      return ensureCollection(name).find((item) => item.id === id) || null;
    },
    findOne(name, predicate) {
      return ensureCollection(name).find(predicate) || null;
    },
    filter(name, predicate) {
      return ensureCollection(name).filter(predicate);
    },
    create(name, payload) {
      const collection = ensureCollection(name);
      const item = {
        id: payload.id || `${name}-${crypto.randomUUID()}`,
        ...payload,
      };
      collection.push(item);
      return clone(item);
    },
    update(name, id, updater) {
      const collection = ensureCollection(name);
      const index = collection.findIndex((item) => item.id === id);

      if (index === -1) {
        return null;
      }

      const current = collection[index];
      const nextValue =
        typeof updater === "function"
          ? updater(current)
          : { ...current, ...updater };

      collection[index] = nextValue;
      return clone(nextValue);
    },
    remove(name, id) {
      const collection = ensureCollection(name);
      const index = collection.findIndex((item) => item.id === id);

      if (index === -1) {
        return null;
      }

      const [removed] = collection.splice(index, 1);
      return clone(removed);
    },
    snapshot() {
      return clone(db);
    },
    collections,
  };
}

const store = createStore();

module.exports = { store, createStore };
