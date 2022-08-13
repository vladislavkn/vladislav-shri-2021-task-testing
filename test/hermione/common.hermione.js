const { assert } = require("chai");

describe("Общие требования: ", () => {
  describe("Вёрстка должна адаптироваться под ширину экрана", async function () {
    async function checkIfHasHorizontalScroll(browser, width) {
      await browser.setWindowSize(width, 1280);
      await browser.url("http://localhost:3000/hw/store");
      await browser.waitUntil(
        () => browser.execute(() => document.readyState === "complete"),
        {
          timeout: 60 * 1000,
          timeoutMsg: "Browser did not load in 60s",
        }
      );
      const res = await browser.execute(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
        []
      );
      return Boolean(res);
    }

    it("1400px", async function () {
      const hasHorizontalScroll = await checkIfHasHorizontalScroll(
        this.browser,
        1400
      );
      assert.isFalse(hasHorizontalScroll);
    });

    it("992px", async function () {
      const hasHorizontalScroll = await checkIfHasHorizontalScroll(
        this.browser,
        992
      );
      assert.isFalse(hasHorizontalScroll);
    });

    it("576px", async function () {
      const hasHorizontalScroll = await checkIfHasHorizontalScroll(
        this.browser,
        576
      );
      assert.isFalse(hasHorizontalScroll);
    });

    it("360px", async function () {
      const hasHorizontalScroll = await checkIfHasHorizontalScroll(
        this.browser,
        360
      );
      assert.isFalse(hasHorizontalScroll);
    });
  });

  it("В шапке отображаются ссылки на страницы магазина", async function () {
    await this.browser.url("http://localhost:3000/hw/store");
    const navbar = await this.browser.$("nav.navbar");
    await navbar.waitForExist();
    await navbar.scrollIntoView();

    const catalogLink = await this.browser.$(
      ".nav-link[href='/hw/store/catalog']"
    );

    const deliveryLink = await this.browser.$(
      ".nav-link[href='/hw/store/delivery']"
    );
    const contactsLink = await this.browser.$(
      ".nav-link[href='/hw/store/contacts']"
    );
    const cartLink = await this.browser.$(".nav-link[href='/hw/store/cart']");

    assert.isTrue(await catalogLink.isExisting());
    assert.isTrue(await deliveryLink.isExisting());
    assert.isTrue(await contactsLink.isExisting());
    assert.isTrue(await cartLink.isExisting());
  });

  it("название магазина в шапке должно быть ссылкой на главную страницу", async function () {
    await this.browser.url("http://localhost:3000/hw/store");
    const title = await this.browser.$(".Application-Brand.navbar-brand");
    await title.waitForExist();

    assert.equal(await title.getAttribute("href"), "/hw/store/");
  });

  // it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async function () {
  //   await this.browser.url("http://localhost:3000/hw/store");
  //   const menu = await this.browser.$(".Application-Menu.navbar-collapse");
  //   const toggler = await this.browser.$(".Application-Toggler.navbar-toggler");

  //   await this.browser.setWindowSize(576, 1280);
  //   await menu.waitForExist();
  //   await menu.scrollIntoView();
  //   assert.isTrue(await menu.isDisplayed());
  //   await toggler.waitForExist();
  //   await toggler.scrollIntoView();
  //   assert.isFalse(await toggler.isDisplayed());

  //   await this.browser.setWindowSize(575, 1280);
  //   assert.isFalse(await menu.isDisplayed());
  //   await toggler.waitForExist();
  //   await toggler.scrollIntoView();
  //   assert.isTrue(await toggler.isDisplayed());
  // });

  // it('при выборе элемента из меню "гамбургера", меню должно закрываться.', async function () {
  //   await this.browser.url("http://localhost:3000/hw/store");
  //   await this.browser.setWindowSize(575, 1280);

  //   const menu = await this.browser.$(".Application-Menu.navnar-collapse");
  //   const link = await this.browser.$(
  //     ".navbar-nav a[href='/hw/store/catalog']"
  //   );
  //   const toggler = await this.browser.$(".Application-Toggler.navbar-toggler");

  //   await toggler.waitForExist();
  //   await toggler.scrollIntoView();
  //   await toggler.click();
  //   await link.waitForExist();
  //   await link.scrollIntoView();
  //   await link.click();

  //   await menu.waitForExist();
  //   await menu.scrollIntoView();
  //   assert.isFalse(await menu.isDisplayed());
  // });
});
