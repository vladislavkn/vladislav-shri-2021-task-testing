const { assert } = require("chai");
const {
  openProductPage,
  getCurrentProductName,
  addCurrentProductToCart,
  getCartItem,
  getCartItemText,
  clearCart,
  reloadPage,
  getCartItemCount,
  pages,
} = require("./utils");

describe("Каталог -", () => {
  it("если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом", async ({
    browser,
  }) => {
    // Переходим на страницу товара
    await openProductPage({ testId: 0, browser });

    // Получаем название товара
    const productName = await getCurrentProductName(browser);

    await clearCart(browser);

    // Добавляем товар в корзину
    await addCurrentProductToCart(browser);

    // Проверяем, что отобразился бейдж "товар в корзине"
    const itemAddedBadge = await browser.$(".CartBadge");
    await itemAddedBadge.waitForExist();
    assert.isTrue(await itemAddedBadge.isDisplayed());

    // Переходим на страницу корзины
    await browser.url(pages.CART);

    // Проверяем, что есть строка с товаром
    const cartItem = await getCartItem({ browser, testId: 0 });
    assert.isTrue(await cartItem.isDisplayed());

    // Проверяем, что название товара соответствует добавленному
    const cartItemText = await getCartItemText(cartItem);
    assert.equal(cartItemText, productName);
  });

  it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async ({
    browser,
  }) => {
    // Переходим на страницу товара
    await openProductPage({ testId: 0, browser });

    // Получаем название товара
    const productName = await getCurrentProductName(browser);

    await clearCart(browser);

    // Добавляем товар в корзину
    await addCurrentProductToCart(browser);

    // Переходим на страницу корзины
    await browser.url(pages.CART);

    // Проверяем, что есть строка с товаром
    let cartItem = await getCartItem({ browser, testId: 0 });
    assert.isTrue(await cartItem.isDisplayed());

    // Проверяем, что название товара соответствует добавленному
    let cartItemText = await getCartItemText(cartItem);
    assert.equal(cartItemText, productName);

    let cartItemCount = await getCartItemCount(cartItem);
    assert.equal(cartItemCount, 1);

    await openProductPage({ testId: 0, browser });
    await addCurrentProductToCart(browser);
    await browser.url(pages.CART);

    cartItem = await getCartItem({ browser, testId: 0 });
    assert.isTrue(await cartItem.isDisplayed());

    cartItemText = await getCartItemText(cartItem);
    assert.equal(cartItemText, productName);

    cartItemCount = await getCartItemCount(cartItem);
    assert.equal(cartItemCount, 2);
  });

  it("содержимое корзины должно сохраняться между перезагрузками страницы", async ({
    browser,
  }) => {
    await openProductPage({ testId: 0, browser });
    const productName = await getCurrentProductName(browser);
    await clearCart(browser);
    await addCurrentProductToCart(browser);

    await browser.url(pages.CART);
    let cartItem = await getCartItem({ browser, testId: 0 });
    assert.isTrue(await cartItem.isDisplayed());

    let cartItemText = await getCartItemText(cartItem);
    assert.equal(cartItemText, productName);

    let cartItemCount = await getCartItemCount(cartItem);
    assert.equal(cartItemCount, 1);

    await reloadPage(browser);

    cartItem = await getCartItem({ browser, testId: 0 });
    assert.isTrue(await cartItem.isDisplayed());

    cartItemText = await getCartItemText(cartItem);
    assert.equal(cartItemText, productName);

    cartItemCount = await getCartItemCount(cartItem);
    assert.equal(cartItemCount, 1);
  });
});
