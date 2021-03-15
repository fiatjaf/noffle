import { relayPool, makeRandom32, verifySignature } from "nostr-tools";
import { update } from "idb-keyval";
import { idbSet, idbGet } from "./db";

export const relays = [
  { host: "wss://nostr-relay.herokuapp.com", policy: "rw" },
  { host: "wss://moonbreeze.richardbondi.net/ws", policy: "rw" },
  { host: "wss://nodestr-relay.dolu.dev/ws", policy: "rw" },
];

export const pool = relayPool();

export function parsePolicy(rw) {
  let policy = {};
  if (rw.indexOf("r") !== -1) policy.read = true;
  if (rw.indexOf("w") !== -1) policy.write = true;
  return policy;
}

export const setRelays = () => {
  idbSet("relays", [...relays]);
};

export const subscribeRelays = async () => {
  let r = await idbGet("relays");
  r.map((relay) => {
    pool.addRelay(relay.host, parsePolicy(relay.policy));
  });
};

export const getNewKey = () => {
  let secretKey = Buffer.from(makeRandom32()).toString("hex");
  localStorage.setItem("key", secretKey);
  return secretKey;
};

export const validSig = (key) => verifySignature(key);
