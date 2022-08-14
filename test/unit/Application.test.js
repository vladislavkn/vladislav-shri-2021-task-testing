import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom";
import { createMockStore } from "./utils";
import { Application } from "../../src/client/Application";
import * as React from "react";

describe("Компонент Application", () => {
  it("в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину", () => {
    const mockStore = createMockStore({ cart: {} });

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Application />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole("link", { name: /example store/i })).not.toBeNull();
    expect(screen.getByRole("link", { name: /catalog/i })).not.toBeNull();
    expect(screen.getByRole("link", { name: /delivery/i })).not.toBeNull();
    expect(screen.getByRole("link", { name: /contacts/i })).not.toBeNull();
    expect(screen.getByRole("link", { name: /cart/i })).not.toBeNull();
  });

  it("название магазина в шапке должно быть ссылкой на главную страницу", () => {
    const mockStore = createMockStore({ cart: {} });

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Application />
        </BrowserRouter>
      </Provider>
    );

    const homeLink = screen.getByRole("link", { name: /example store/i });
    expect(homeLink.getAttribute("href")).toBe("/");
  });
});
