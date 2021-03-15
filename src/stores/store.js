import { writable } from "svelte/store";
import { getPublicKey, verifySignature } from "nostr-tools";
import { SortedMap } from "insort";
import LRU from "quick-lru";
import { pool } from "../lib/relay";
import { idbSet, idbUpdate, idbDel, idbPut } from "../lib/db";

let secretKey = localStorage.getItem("key");
// if (!secretKey) {
//   secretKey = Buffer.from(makeRandom32()).toString("hex");
//   localStorage.setItem("key", secretKey);
// }

pool.setPrivateKey(secretKey);

const initialState = {
  key: secretKey,
  pubKeyHex: "",
  following: [],
  home: new SortedMap(),
  metadata: new LRU({ maxSize: 100 }),
  browsing: new LRU({ maxSize: 500 }),
  publishStatus: {},
  petnames: {},
  ignoredRelays: {},
  initialised: false,
};

const { subscribe, set, update } = writable(initialState);

export default {
  subscribe,
  updateFollow: (action, pubKey) =>
    update((state) => {
      if (action === "follow") {
        state.following.push(pubKey);
        idbUpdate("following", { pubKey });
      } else {
        state.following.splice(state.following.indexOf(pubKey), 1);
        idbDel("following", pubKey, "pubKey");
      }
      return state;
    }),
  setKey: (key) =>
    update((state) => {
      let pubKey = getPublicKey(key);
      state.key = key;
      state.pubKey = pubKey;
      // state.following.push(pubKey)
      idbSet("following", [{ pubKey }]);
      return state;
    }),
  initStore: (data) => {
    update((state) => {
      let [f, notes, e, p] = data;
      let follow = f.map((r) => r.pubKey);
      state.following = follow;
      state.home = new SortedMap(
        notes.map((n) => [n.id + ":" + n.created_at, n]),
        (a, b) => b.split(":")[1] - a.split(":")[1]
      );
      return state;
    });
  },
  initApp: () =>
    update((state) => {
      state.initialised = true;
      return state;
    }),
  pubKeyHex: (key) => getPublicKey(key),
  receivedTextNote: (evt, mine = false) => {
    if (mine) {
      idbPut("mynotes", evt);
    }
    update((state) => {
      state.browsing.set(evt.id.slice(0, 5), evt);
      state.home.set(`${evt.id}:${evt.created_at}`, evt);

      if (evt.ref && evt.ref.length) {
        state.browsing.set(
          `rel:${evt.ref.slice(0, 5)}:${evt.id.slice(0, 5)}`,
          evt
        );
      }
      return state;
    });
  },
};
