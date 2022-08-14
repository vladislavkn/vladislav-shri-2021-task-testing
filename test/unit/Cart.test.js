import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMockStore, createProducts } from "./utils";
import { Cart } from "../../src/client/pages/Cart";
import * as React from "react";

describe("Страница Cart", () => {
  it("для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа", () => {
    const mockProducts = createProducts(3).map((product) => ({
      ...product,
      count: product.id,
      total: product.price * product.id,
    }));
    const mockStore = createMockStore({
      cart: mockProducts.reduce((products, product) => {
        products[product.id] = product;
        return products;
      }, {}),
    });

    const { container } = render(
      <Provider store={mockStore}>
        <Cart />
      </Provider>
    );

    const cartItems = Array.from(
      container.querySelectorAll("table tr[data-testid]")
    );
    const cartItemsData = cartItems.map((cartItem) => ({
      id: Number(cartItem.getAttribute("data-testid")),
      count: Number(cartItem.querySelector(".Cart-Count").textContent),
      name: cartItem.querySelector(".Cart-Name").textContent,
      price: Number(cartItem.querySelector(".Cart-Price").textContent.slice(1)),
      total: Number(cartItem.querySelector(".Cart-Total").textContent.slice(1)),
    }));

    expect(cartItemsData).toEqual(mockProducts);

    const orderPriceElement = container.querySelector(".Cart-OrderPrice");
    const totalPrice = Number(orderPriceElement.textContent.slice(1));
    const expectedPrice = mockProducts.reduce(
      (sum, product) => sum + product.total,
      0
    );

    expect(totalPrice).toEqual(expectedPrice);
  });
});
