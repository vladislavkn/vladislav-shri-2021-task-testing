const pages = {
  HOME: "http://localhost:3000/hw/store/",
  CATALOG: "http://localhost:3000/hw/store/catalog",
  DELIVERY: "http://localhost:3000/hw/store/delivery",
  CONTACTS: "http://localhost:3000/hw/store/contacts",
  CART: "http://localhost:3000/hw/store/cart",
};

module.exports.pages = pages;

module.exports.openProductPage = async ({ testId, browser }) => {
  await browser.url(pages.CATALOG);
  const productCard = await browser.$(`.ProductItem[data-testid="${testId}"]`);
  await productCard.waitForExist();
  const productDetailsLink = await productCard.$(".ProductItem-DetailsLink");
  await productDetailsLink.waitForExist();
  await productDetailsLink.click();
};

module.exports.getCurrentProductName = async (browser) => {
  const productTitle = await browser.$(".ProductDetails-Name");
  await productTitle.waitForExist();
  return await productTitle.getText();
};

module.exports.addCurrentProductToCart = async (browser) => {
  const addToCartButton = await browser.$(".ProductDetails-AddToCart");
  await addToCartButton.waitForExist();
  await addToCartButton.click();
};

module.exports.getCurrentProductPrice = async (browser) => {
  const productPriceElement = await browser.$(".ProductDetails-Price");
  await productPriceElement.waitForExist();
  const price = await productPriceElement.getText();
  return Number(price.slice(1));
};

module.exports.getCartItem = async ({ browser, testId }) => {
  const cartItem = await browser.$(`tr[data-testid="${testId}"]`);
  await cartItem.waitForExist();
  return cartItem;
};

module.exports.getCartItemText = async (cartItem) => {
  const cartItemTitleElement = await cartItem.$(".Cart-Name");
  await cartItemTitleElement.waitForExist();
  return await cartItemTitleElement.getText();
};

module.exports.getCartItemCount = async (cartItem) => {
  const cartItemCountElement = await cartItem.$(".Cart-Count");
  await cartItemCountElement.waitForExist();
  const count = await cartItemCountElement.getText();
  return Number(count);
};

module.exports.getCartItemPrice = async (cartItem) => {
  const cartItemPriceElement = await cartItem.$(".Cart-Price");
  await cartItemPriceElement.waitForExist();
  const price = await cartItemPriceElement.getText();
  return Number(price.slice(1));
};

module.exports.getCartItemTotal = async (cartItem) => {
  const cartItemTotalElement = await cartItem.$(".Cart-Total");
  await cartItemTotalElement.waitForExist();
  const total = await cartItemTotalElement.getText();
  return Number(total.slice(1));
};

module.exports.clearCart = async (browser) => {
  await browser.execute(() => {
    localStorage.removeItem("example-store-cart");
  }, []);
};

module.exports.reloadPage = async (browser) => {
  await browser.execute(() => document.location.reload(), []);
};

module.exports.checkUrlExists = async ({ browser, url }) => {
  await browser.url(url);
  const appElement = await browser.$(".Application");
  await appElement.waitForExist();

  return await appElement.isDisplayed();
};

module.exports.getPageHTMLs = async ({ browser, url, timeout = 3000 }) => {
  await browser.url(url);
  const appElement = await browser.$(".Application");
  await appElement.waitForExist();

  const firstHTML = await appElement.getHTML();
  await browser.pause(timeout);
  const secondHTML = await appElement.getHTML();

  return [firstHTML, secondHTML];
};
