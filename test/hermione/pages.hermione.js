const { assert } = require("chai");
const { checkUrlExists, getPageHTMLs, pages } = require("./utils");

describe("Страницы", () => {
  it("главная, каталог, условия доставки, контакты существуют", async ({
    browser,
  }) => {
    const homePageExists = await checkUrlExists({
      browser,
      url: pages.HOME,
    });
    const catalogPageExists = await checkUrlExists({
      browser,
      url: pages.CATALOG,
    });
    const deliveryPageExists = await checkUrlExists({
      browser,
      url: pages.DELIVERY,
    });
    const contactsPageExists = await checkUrlExists({
      browser,
      url: pages.CONTACTS,
    });

    assert.isTrue(homePageExists);
    assert.isTrue(catalogPageExists);
    assert.isTrue(deliveryPageExists);
    assert.isTrue(contactsPageExists);
  });

  it("главная, условия доставки, контакты должны иметь статическое содержимое", async ({
    browser,
  }) => {
    const homePageHTMLs = await getPageHTMLs({
      browser,
      url: pages.HOME,
    });

    const deliveryPageHTMLs = await getPageHTMLs({
      browser,
      url: pages.DELIVERY,
    });

    const contactsPageHTMLs = await getPageHTMLs({
      browser,
      url: pages.CONTACTS,
    });

    assert.equal(...homePageHTMLs);
    assert.equal(...deliveryPageHTMLs);
    assert.equal(...contactsPageHTMLs);
  });

  it("главная, условия доставки, контакты сохранили верстку", async ({
    browser,
  }) => {
    await browser.url(pages.HOME);
    await browser.assertView("plain-home", "#root", {
      compositeImage: true,
    });

    await browser.url(pages.DELIVERY);
    await browser.assertView("plain-delivery", "#root", {
      compositeImage: true,
    });

    await browser.url(pages.CONTACTS);
    await browser.assertView("plain-contacts", "#root", {
      compositeImage: true,
    });
  });
});
