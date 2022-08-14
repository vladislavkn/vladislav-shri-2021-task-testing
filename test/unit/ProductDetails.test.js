import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { ProductDetails } from "../../src/client/components/ProductDetails";
import { createMockStore, createProduct } from "./utils";
import * as React from "react";

describe("Компонент productDetails", () => {
  it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', () => {
    const mockProduct = createProduct(0, true);
    const mockStore = createMockStore({ cart: {} });

    render(
      <Provider store={mockStore}>
        <ProductDetails product={mockProduct} />
      </Provider>
    );

    expect(screen.queryByText(mockProduct.name)).not.toBeNull();
    expect(screen.queryByText(mockProduct.description)).not.toBeNull();
    expect(screen.queryByText(`$${mockProduct.price}`)).not.toBeNull();
    expect(screen.queryByText(mockProduct.color)).not.toBeNull();
    expect(screen.queryByText(mockProduct.material)).not.toBeNull();
    expect(screen.getByRole("button", { name: /add to cart/i })).not.toBeNull();
  });
});
