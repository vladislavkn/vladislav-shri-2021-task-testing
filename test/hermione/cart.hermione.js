const { assert } = require("chai");
const {
  clearCart,
  openProductPage,
  addCurrentProductToCart,
  getCurrentProductName,
  getCartItem,
  getCartItemText,
  getCurrentProductPrice,
  getCartItemPrice,
  getCartItemTotal,
  reloadPage,
  pages,
} = require("./utils");

describe("Корзина -", () => {
  it("в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней", async ({
    browser,
  }) => {
    await openProductPage({ testId: 0, browser });
    await clearCart(browser);
    await addCurrentProductToCart(browser);

    await openProductPage({ testId: 1, browser });
    await addCurrentProductToCart(browser);

    const cartLink = await browser.$('.navbar-nav [href="/hw/store/cart"]');
    await cartLink.waitForExist();
    const cartLinkText = await cartLink.getText();
    assert.equal(cartLinkText, "Cart (2)");
  });

  it("в корзине должна отображаться таблица с добавленными в нее товарами", async ({
    browser,
  }) => {
    await openProductPage({ testId: 0, browser });
    await clearCart(browser);
    const firstProductName = await getCurrentProductName(browser);
    const firstProductPrice = await getCurrentProductPrice(browser);
    await addCurrentProductToCart(browser);

    await openProductPage({ testId: 1, browser });
    const secondProductName = await getCurrentProductName(browser);
    const secondProductPrice = await getCurrentProductPrice(browser);
    await addCurrentProductToCart(browser);

    await browser.url(pages.CART);

    const firstCartItem = await getCartItem({ browser, testId: 0 });
    assert.isTrue(await firstCartItem.isDisplayed());
    const firstCartItemText = await getCartItemText(firstCartItem);
    assert.equal(firstCartItemText, firstProductName);
    const firstCartItemPrice = await getCartItemPrice(firstCartItem);
    assert.equal(firstCartItemPrice, firstProductPrice);
    const firstCartItemTotal = await getCartItemTotal(firstCartItem);
    assert.equal(firstCartItemTotal, firstProductPrice);

    const secondCartItem = await getCartItem({ browser, testId: 1 });
    assert.isTrue(await secondCartItem.isDisplayed());
    const secondCartItemText = await getCartItemText(secondCartItem);
    assert.equal(secondCartItemText, secondProductName);
    const secondCartItemPrice = await getCartItemPrice(secondCartItem);
    assert.equal(secondCartItemPrice, secondProductPrice);
    const secondCartItemTotal = await getCartItemTotal(secondCartItem);
    assert.equal(secondCartItemTotal, secondProductPrice);
  });

  it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async ({
    browser,
  }) => {
    await openProductPage({ testId: 0, browser });
    await clearCart(browser);
    await addCurrentProductToCart(browser);

    await browser.url(pages.CART);
    let cartItem = await getCartItem({ browser, testId: 0 });
    assert.isTrue(await cartItem.isDisplayed());

    const cartClearButton = await browser.$(".Cart-Clear");
    await cartClearButton.waitForExist();
    assert.isTrue(await cartClearButton.isDisplayed());

    await cartClearButton.click();
    assert.isFalse(await cartItem.isDisplayed());
  });

  it("если корзина пустая, должна отображаться ссылка на каталог товаров", async ({
    browser,
  }) => {
    await browser.url(pages.CART);
    await clearCart(browser);
    await reloadPage(browser);

    const catalogLink = await browser.$('.Cart a[href="/hw/store/catalog"]');
    await catalogLink.waitForExist();
    assert.isTrue(await catalogLink.isDisplayed());
  });
});
