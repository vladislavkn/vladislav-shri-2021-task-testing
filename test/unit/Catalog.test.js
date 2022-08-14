import { createMockStore, createProducts } from "./utils";
import * as React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { Catalog } from "../../src/client/pages/Catalog";
import { BrowserRouter } from "react-router-dom";

describe("Страница Catalog", () => {
  it("должны отображаться товары, список которых приходит с сервера", () => {
    const mockProducts = createProducts(10, false);
    const mockStore = createMockStore({ products: mockProducts, cart: {} });
    const { container } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Catalog />
        </BrowserRouter>
      </Provider>
    );
    const productItemElements = Array.from(
      container.querySelectorAll(".ProductItem")
    );

    const renderedProductItemsData = productItemElements.map(
      (productItemElement) => ({
        id: Number(productItemElement.getAttribute("data-testid")),
        name: productItemElement.querySelector(".ProductItem-Name")
          ?.textContent,
        price: Number(
          productItemElement
            .querySelector(".ProductItem-Price")
            ?.textContent?.slice(1)
        ),
      })
    );

    expect(renderedProductItemsData).toEqual(mockProducts);
  });

  it("для каждого товара отображается ссылка на страницу товара", () => {
    const mockProducts = createProducts(10, false);
    const mockStore = createMockStore({ products: mockProducts, cart: {} });
    const { container } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Catalog />
        </BrowserRouter>
      </Provider>
    );
    const productItemElements = Array.from(
      container.querySelectorAll(".ProductItem")
    );

    const linkHrefs = productItemElements.map((productItemElement) => {
      const linkElement = productItemElement.querySelector(
        ".ProductItem-DetailsLink"
      );
      return linkElement.getAttribute("href");
    });

    const productExpectedLinks = mockProducts.map(
      (product) => `/catalog/${product.id}`
    );

    expect(linkHrefs).toEqual(productExpectedLinks);
  });
});
