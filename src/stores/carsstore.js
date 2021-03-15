import { writable } from "svelte/store";

const CARS = [
  { make: "Ford", model: "Taurus", year: "2015" },
  { make: "Toyota", model: "Avalon", year: "2013" },
];

const { subscribe, set, update } = writable(CARS);

const addCar = (car) =>
  update((cars) => {
    return [...cars, car];
  });

const reset = () => {
  set(CARS);
};

export default {
  subscribe,
  addCar,
  reset,
};
