import { Product, ProductShortInfo } from "../../src/common/types";
import { createStore } from "redux";

export const createProduct = (i, withExtraFields) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: (i + 1) * 1000,
  ...(withExtraFields
    ? {
        description: `Description ${i + 1}`,
        material: `Material ${i + 1}`,
        color: `Color ${i + 1}`,
      }
    : {}),
});

export const createProducts = (amount, withExtraFields) =>
  [...new Array(amount)].map((_, i) => createProduct(i, withExtraFields));

export const createMockStore = (data) => {
  return createStore(() => data);
};
