const { assert } = require("chai");
const { pages } = require("./utils");

describe("Общие требования -", () => {
  beforeEach(async ({ browser }) => {
    await browser.url(pages.HOME);
  });

  async function checkIfHasHorizontalScroll({ browser, width }) {
    await browser.setWindowSize(width, 1280);
    await browser.waitUntil(
      () => browser.execute(() => document.readyState === "complete"),
      {
        timeout: 60 * 1000,
        timeoutMsg: "Browser did not load in 60s",
      }
    );
    return await browser.execute(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      []
    );
  }

  it("Вёрстка должна адаптироваться под ширину экрана", async ({ browser }) => {
    const hasHorizontalScrollOn1400 = await checkIfHasHorizontalScroll({
      browser,
      width: 1400,
    });

    const hasHorizontalScrollOn992 = await checkIfHasHorizontalScroll({
      browser,
      width: 992,
    });

    const hasHorizontalScrollOn576 = await checkIfHasHorizontalScroll({
      browser,
      width: 576,
    });

    const hasHorizontalScrollOn360 = await checkIfHasHorizontalScroll({
      browser,
      width: 360,
    });

    assert.isFalse(hasHorizontalScrollOn1400);
    assert.isFalse(hasHorizontalScrollOn992);
    assert.isFalse(hasHorizontalScrollOn576);
    assert.isFalse(hasHorizontalScrollOn360);
  });

  it("В шапке отображаются ссылки на страницы магазина", async function () {
    const catalogLink = await this.browser.$(
      ".nav-link[href='/hw/store/catalog']"
    );
    await catalogLink.waitForExist();

    const deliveryLink = await this.browser.$(
      ".nav-link[href='/hw/store/delivery']"
    );
    await deliveryLink.waitForExist();

    const contactsLink = await this.browser.$(
      ".nav-link[href='/hw/store/contacts']"
    );
    await contactsLink.waitForExist();

    const cartLink = await this.browser.$(".nav-link[href='/hw/store/cart']");
    await cartLink.waitForExist();

    assert.isTrue(await catalogLink.isExisting());
    assert.isTrue(await deliveryLink.isExisting());
    assert.isTrue(await contactsLink.isExisting());
    assert.isTrue(await cartLink.isExisting());
  });

  it("название магазина в шапке должно быть ссылкой на главную страницу", async function () {
    const title = await this.browser.$(".Application-Brand.navbar-brand");
    await title.waitForExist();

    assert.equal(await title.getAttribute("href"), "/hw/store/");
  });

  it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async function () {
    const menu = await this.browser.$(".Application-Menu.navbar-collapse");
    const toggler = await this.browser.$(".Application-Toggler.navbar-toggler");

    await this.browser.setWindowSize(576, 1280);

    await menu.waitForExist();
    assert.isTrue(await menu.isDisplayed());
    await toggler.waitForExist();
    assert.isFalse(await toggler.isDisplayed());

    await this.browser.setWindowSize(575, 1280);

    assert.isFalse(await menu.isDisplayed());
    await toggler.waitForExist();
    assert.isTrue(await toggler.isDisplayed());
  });

  it('при выборе элемента из меню "гамбургера", меню должно закрываться.', async function () {
    await this.browser.setWindowSize(575, 1280);

    const menu = await this.browser.$(".Application-Menu.navnar-collapse");
    const link = await this.browser.$(
      ".navbar-nav a[href='/hw/store/catalog']"
    );
    const toggler = await this.browser.$(".Application-Toggler.navbar-toggler");

    await toggler.waitForExist();
    await toggler.waitForClickable();
    await toggler.click();

    await link.waitForExist();
    await link.waitForClickable();
    await link.click();

    assert.isFalse(await menu.isDisplayed());
  });
});
