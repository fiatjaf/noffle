import {
  createStore,
  clear,
  setMany,
  get,
  getMany,
  set,
  update,
  del,
} from "idb-keyval";

const db = createStore("crudeDB", "crudeStore");

if (localStorage.getItem("deleted") < "5") {
  clear(db).then(() => {
    localStorage.setItem("deleted", "5");
    location.reload();
  });
}

// set('mynotes', [], db)

export const idbGet = (key) => get(key, db);

export const idbGetMany = (keys) => getMany(keys, db);

export const idbSet = (key, val) => set(key, val, db);

export const idbUpdate = (key, val) => {
  update(key, (old) => [...old, val], db);
};

export const idbPut = (key, val) => {
  update(
    key,
    (old) => {
      let compare;
      switch (key) {
        case "relays":
          compare = "host";
          break;
        case "mynotes":
          compare = "id";
          break;
        default:
          compare = false;
      }

      let exists = old.some((n) => n[compare] === val[compare]);
      let index = old.map((r) => r[compare].indexOf(val[compare]));
      if (exists) {
        old.splice(index, 1, val);
        return old;
      }
      return [...old, val];
    },
    db
  );
};

export const idbDel = (key, val, prop) => {
  update(key, (old) => {
    let index = old.map((r) => r[prop]).indexOf(val);
    old.splice(index, 1);
  });
};

export const initDB = () =>
  setMany(
    [
      ["relays", []],
      ["following", []],
      ["mynotes", []],
      ["publishlog", []],
      ["events", []],
      ["contactlist", []],
    ],
    db
  );
