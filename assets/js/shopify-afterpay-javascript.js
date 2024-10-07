var afterpay_product_integration_enabled,
  afterpay_cart_integration_enabled,
  afterpay_dynamic_cart_integration_enabled,
  afterpay_dynamic_cart_observer_target,
  afterpay_variable_price_fallback,
  afterpay_variable_subtotal_fallback,
  afterpay_modal_open_icon,
  afterpay_hide_upper_limit,
  afterpay_hide_lower_limit,
  afterpay_logo_theme,
  afterpay_footer_logo_enabled,
  afterpay_footer_logo_format,
  afterpay_footer_logo_theme,
  afterpay_footer_logo_background,
  afterpay_js_language,
  afterpay_js_country,
  afterpay_msg_size,
  afterpay_show_if_outside_limits,
  afterpay_bold_amount,
  afterpay_product_collections,
  afterpay_cart_skus,
  afterpay_cart_collections,
  Afterpay = {
    supportedTheme: !1,
    mutationObserver: !1,
    arrayContainsElement: function (t, e) {
      var a;
      if (Array.prototype.indexOf) return -1 < t.indexOf(e);
      for (a = 0; a < t.length; a++) if (t[a] == e) return !0;
      return !1;
    },
    commonElements: {
      product: {
        price_selector: [
          "#ProductPrice",
          "#product-price",
          "#ProductSection .product-single__prices",
          ".product-details .product-price",
          ".product--container .product-pricing",
          ".productForm .product-price",
          ".product-single__meta .product__price",
          ".product__content .product__price",
          "p.modal_price",
          "ul.product-meta",
          "ul.product-single__meta-list",
          ".product-single__price",
          ".product-single__prices",
          ".product__price",
          ".price",
          ".prices",
          ".product_price",
          ".modal_price",
          ".product-block--price",
        ],
      },
      cart: {
        static_page: {
          subtotal_selector: [
            "#CartSubtotal",
            "form .subtotal_amount",
            ".cart__footer .cart__subtotal",
            ".cart-footer .cart-footer__subtotal",
            "span.cart__subtotal",
            ".h1.cart-subtotal--price",
            ".cart__row--table:last",
            ".cart-subtotal",
          ],
        },
      },
      footer: {
        logo_container: [
          "footer ul.payment-icons",
          "footer div.payment-methods__inner",
          "footer .payment-options",
          "footer ul.payment-icons--list",
          "footer .payment-types ul",
          "footer .site-footer-payment-types",
          "footer #payment",
          "footer ul.payment-icon-list",
          ".footer .payment_methods",
          "footer ul.Footer__PaymentList",
          "footer .payment-types",
          ".page-footer ul.payment-methods",
          "#pagefooter .payment-methods",
          "footer ul.footer__icons-items",
          "footer div.payment_methods",
          "footer div.payment-methods",
        ],
      },
    },
    init: function (t) {
      (Afterpay.supportedTheme =
        Afterpay.supportedThemes[afterpay_theme_name.toLowerCase()]),
        (Afterpay.mutationObserver =
          window.MutationObserver || window.WebKitMutationObserver);
      var e = new RegExp("(collections_products)/index.html", "i"),
        a = new RegExp("/cart", "i");
      if (
        (e.test(window.location.pathname) &&
        afterpay_product &&
        afterpay_product_integration_enabled
          ? Afterpay.initProductPage(t)
          : a.test(window.location.pathname) &&
            0 != afterpay_cart_integration_enabled &&
            Afterpay.initStaticCartPage(t),
        Afterpay.initFooterLogo(t),
        afterpay_dynamic_cart_integration_enabled &&
          "string" == typeof afterpay_dynamic_cart_selector)
      ) {
        const c = "placement-" + Date.now(),
          p = document.createElement("square-placement");
        var o,
          r = {
            ...afterpay_placement_attrs,
            id: c,
            "data-page-type": "mini-cart",
            "data-item-skus": afterpay_cart_skus,
            "data-item-categories": afterpay_cart_collections,
            "data-show-interest-free": !1,
          };
        for (o in r) p.setAttribute(o, r[o]);
        "object" == typeof afterpay_dynamic_cart_css &&
          t(p).css(afterpay_dynamic_cart_css);
        const l = () => {
          var t = document.querySelector(afterpay_dynamic_cart_selector);
          t &&
            (p.setAttribute("data-amount", afterpay_cart_total_price / 100),
            t.after(p));
        };
        l(),
          Afterpay.mutationObserver &&
            new Afterpay.mutationObserver((t) => {
              for (var e of t)
                if (
                  0 < e.addedNodes.length &&
                  "SQUARE-PLACEMENT" == e.addedNodes[0].nodeName &&
                  e.addedNodes[0].id == c
                )
                  return;
              document.querySelector(afterpay_dynamic_cart_selector) &&
                fetch("cart.js")
                  .then((t) => t.json())
                  .then((t) => {
                    (afterpay_cart_total_price = t.total_price),
                      document.getElementById(c)
                        ? document
                            .getElementById(c)
                            .setAttribute(
                              "data-amount",
                              afterpay_cart_total_price / 100
                            )
                        : l();
                  })
                  .catch(console.error);
            }).observe(
              document.querySelector(afterpay_dynamic_cart_observer_target),
              { childList: !0, subtree: !0 }
            );
      }
    },
    initFooterLogo: function (o) {
      if (
        "boolean" == typeof afterpay_footer_logo_enabled &&
        afterpay_footer_logo_enabled
      ) {
        var a,
          r = null,
          c = null,
          e = null;
        if (
          ("string" == typeof afterpay_footer_logo_container
            ? (r = o(afterpay_footer_logo_container))
            : Afterpay.supportedTheme &&
              Afterpay.supportedTheme.hasOwnProperty("footer")
            ? o.each(Afterpay.supportedTheme.footer, function (t, e) {
                if (0 < (r = o(e.logo_container)).length) return !1;
              })
            : (o.each(Afterpay.supportedThemes, function (a, t) {
                var e = new RegExp(a, "i");
                if (
                  e.test(afterpay_theme_name) &&
                  t.hasOwnProperty("footer") &&
                  (o.each(t.footer, function (t, e) {
                    if (0 < (r = o(e.logo_container)).length)
                      return (
                        (Afterpay.supportedTheme = Afterpay.supportedThemes[a]),
                        !1
                      );
                  }),
                  "object" == typeof Afterpay.supportedTheme) &&
                  null !== Afterpay.supportedTheme
                )
                  return !1;
              }),
              (Afterpay.supportedTheme && !0 !== Afterpay.supportedTheme) ||
                o.each(
                  Afterpay.commonElements.footer.logo_container,
                  function (t, e) {
                    if (0 < (r = o(e)).length) return !1;
                  }
                )),
          0 != r.length && 0 != r.children().length)
        )
          if (
            ["icon", "stacked", "logo"].includes(afterpay_footer_logo_format) &&
            ["colour", "color", "black", "white"].includes(
              afterpay_footer_logo_theme
            ) &&
            ["border", "transparent"].includes(afterpay_footer_logo_background)
          ) {
            if (
              ((a =
                "https://static.afterpay.com/icon/afterpay-" +
                afterpay_footer_logo_format +
                "-" +
                afterpay_footer_logo_theme +
                "-" +
                (afterpay_footer_logo_background =
                  "logo" == afterpay_footer_logo_format
                    ? "transparent"
                    : afterpay_footer_logo_background) +
                ".svg"),
              "string" == typeof afterpay_footer_logo_template)
            )
              c = o(afterpay_footer_logo_template.replace("{logo_path}", a));
            else if (
              Afterpay.supportedTheme &&
              Afterpay.supportedTheme.hasOwnProperty("footer")
            )
              o.each(Afterpay.supportedTheme.footer, function (t, e) {
                c = o(e.logo_template.replace("{logo_path}", a));
              });
            else if (
              (c = r.children().first().clone()).is("svg") ||
              c.is("img")
            )
              (e = c.attr("class")),
                (c = c.is("svg")
                  ? o(
                      '<object class="' +
                        e +
                        '" data="' +
                        a +
                        '" type="image/svg+xml"></object>'
                    )
                  : o(
                      '<img class="' + e + '" src="' + a + '" alt="afterpay" />'
                    ));
            else if (c.find("svg").length)
              (e = c.find("svg").attr("class")),
                c
                  .find("svg")
                  .replaceWith(
                    '<object class="' +
                      e +
                      '" data="' +
                      a +
                      '" type="image/svg+xml"></object>'
                  );
            else {
              if (!c.find("img").length) return;
              (e = c.find("img").attr("class")),
                c
                  .find("img")
                  .replaceWith(
                    '<img class="' + e + '" src="' + a + '" alt="afterpay" />'
                  );
            }
            c.is("object") || c.find("object").length
              ? ((e = (c.is("object") ? c : c.find("object")).attr("class")),
                o.get(a + "?co=1", function (t) {
                  c.is("object")
                    ? ((c = o(t.documentElement)).addClass(e),
                      "object" == typeof afterpay_footer_logo_css &&
                        c.css(afterpay_footer_logo_css))
                    : (c.find("object").replaceWith(t.documentElement),
                      c.find("svg").addClass(e),
                      "object" == typeof afterpay_footer_logo_css &&
                        c.find("svg").css(afterpay_footer_logo_css)),
                    r.append(c);
                }))
              : c.is("img")
              ? ("object" == typeof afterpay_footer_logo_css &&
                  c.css(afterpay_footer_logo_css),
                r.append(c))
              : c.find("img").length &&
                ("object" == typeof afterpay_footer_logo_css &&
                  c.find("img").css(afterpay_footer_logo_css),
                r.append(c));
          }
      }
    },
    initProductPage: function (r) {
      var t,
        o = null,
        c = null,
        a = null,
        p = "after",
        l = null,
        i = r(document.createElement("square-placement")),
        s = "placement-" + Date.now(),
        e = {
          ...afterpay_placement_attrs,
          id: s,
          "data-page-type": "product",
          "data-item-skus": afterpay_current_variant.sku,
          "data-item-categories": afterpay_product_collections,
          "data-amount": afterpay_current_variant.price / 100,
        };
      "undefined" != typeof afterpay_product_selector
        ? ((Afterpay.supportedTheme = !0),
          0 < (o = r(afterpay_product_selector)).length &&
            ((l = afterpay_product_selector), (c = o.first())))
        : (Afterpay.supportedTheme
            ? r.each(Afterpay.supportedTheme.product, function (t, e) {
                if (0 < (o = r(e.selector)).length)
                  return (
                    (l = e.selector),
                    (c = o.first()),
                    e.paragraph_css && i.css(e.paragraph_css),
                    !1
                  );
              })
            : ((o = null),
              r.each(Afterpay.supportedThemes, function (a, t) {
                var e = new RegExp(a, "i");
                if (
                  e.test(afterpay_theme_name) &&
                  (r.each(Afterpay.supportedThemes[a].product, function (t, e) {
                    if (0 < (o = r(e.selector)).length)
                      return (
                        (Afterpay.supportedTheme = Afterpay.supportedThemes[a]),
                        (l = e.selector),
                        (c = o.first()),
                        e.paragraph_css && i.css(e.paragraph_css),
                        !1
                      );
                  }),
                  null !== c)
                )
                  return !1;
              })),
          null === c &&
            r.each(
              Afterpay.commonElements.product.price_selector,
              function (t, e) {
                if (0 < (o = r(e)).length)
                  return (
                    (Afterpay.supportedTheme = !0), (l = e), (c = o.first()), !1
                  );
              }
            ),
          null === c &&
            0 < (o = r('form[action^="/cart/add"]')).length &&
            ((l = 'form[action^="/cart/add"]'),
            (c = o.first()),
            (p = "before"),
            (e["data-intro-text"] = "Make"))),
        null !== c &&
          (afterpay_current_variant.available || i.hide(),
          Afterpay.versionCompare(afterpay_js_snippet_version, "1.0.6", ">=") &&
            "after" == p &&
            ("-" == (t = c.css("margin-bottom")).charAt(0)
              ? i.css("margin-top", t.slice(1))
              : i.css("margin-top", "-" + t),
            i.css("margin-bottom", t)),
          "undefined" != typeof afterpay_product_css &&
            i.css(afterpay_product_css),
          i.attr(e),
          c[p](i)),
        0 != afterpay_variable_price_fallback
          ? null !==
              (a =
                null ===
                  (a =
                    "undefined" !=
                      typeof afterpay_variable_price_fallback_selector &&
                    0 <
                      (o = r(afterpay_variable_price_fallback_selector)).length
                      ? o.first()
                      : a) && null !== c
                  ? c
                  : a) &&
            (Afterpay.mutationObserver &&
            "mutation" == afterpay_variable_price_fallback_method
              ? (i.attr("data-amount", a.text()),
                new Afterpay.mutationObserver(function (t, e) {
                  (a = r(afterpay_variable_price_fallback_selector).first()),
                    i.attr("data-amount", a.text()),
                    r("#" + s).length || r(l).first()[p](i);
                }).observe(document.body, {
                  childList: !0,
                  attributes: !1,
                  characterData: !1,
                  subtree: !0,
                  attributeOldValue: !1,
                  characterDataOldValue: !1,
                }))
              : setInterval(function (t) {
                  (a = r(afterpay_variable_price_fallback_selector).first()),
                    i.attr("data-amount", a.text()),
                    r("#" + s).length || r(l).first()[p](i);
                }, 400))
          : r("body").on(
              "change",
              r('form[action^="/cart/add"]'),
              function (t) {
                var t = r(t.target).closest("form"),
                  a = parseInt(
                    r(
                      "input[name=id]:checked, select[name=id], input[name=id], hidden[name=id]",
                      t
                    ).val(),
                    10
                  ),
                  o = !1;
                !isNaN(a) &&
                  0 < a &&
                  r.each(afterpay_product.variants, function (t, e) {
                    e.id == a &&
                      e.available &&
                      ((o = !0), i.attr("data-amount", e.price / 100));
                  }),
                  (o = t
                    .find("input[type=submit],button[type=submit]")
                    .is("[disabled]")
                    ? !1
                    : o)
                    ? i.show()
                    : i.hide();
              }
            );
    },
    initStaticCartPage: function (o) {
      var r = null,
        c = null,
        a = null,
        p = "after",
        l = null,
        i = o(document.createElement("square-placement")),
        s = "placement-" + Date.now(),
        t = {
          ...afterpay_placement_attrs,
          id: s,
          "data-page-type": "cart",
          "data-item-skus": afterpay_cart_skus,
          "data-item-categories": afterpay_cart_collections,
          "data-amount": afterpay_cart_total_price / 100,
          "data-show-interest-free": !1,
        };
      "undefined" != typeof afterpay_cart_static_selector
        ? ((Afterpay.supportedTheme = !0),
          0 < (r = o(afterpay_cart_static_selector)).length &&
            ((l = afterpay_cart_static_selector), (c = r.first())))
        : (Afterpay.supportedTheme
            ? o.each(Afterpay.supportedTheme.cart.static_page, function (t, e) {
                if (0 < (r = o(e.selector)).length)
                  return (
                    (l = e.selector),
                    (c = r.first()),
                    e.paragraph_css && i.css(e.paragraph_css),
                    !1
                  );
              })
            : ((r = null),
              o.each(Afterpay.supportedThemes, function (a, t) {
                var e = new RegExp(a, "i");
                if (
                  e.test(afterpay_theme_name) &&
                  (o.each(
                    Afterpay.supportedThemes[a].cart.static_page,
                    function (t, e) {
                      if (0 < (r = o(e.selector)).length)
                        return (
                          (Afterpay.supportedTheme =
                            Afterpay.supportedThemes[a]),
                          (l = e.selector),
                          (c = r.first()),
                          e.paragraph_css && i.css(e.paragraph_css),
                          !1
                        );
                    }
                  ),
                  null !== c)
                )
                  return !1;
              })),
          null === c &&
            o.each(
              Afterpay.commonElements.cart.static_page.subtotal_selector,
              function (t, e) {
                if (0 < (r = o(e)).length)
                  return (
                    (Afterpay.supportedTheme = !0), (l = e), (c = r.first()), !1
                  );
              }
            ),
          null === c &&
            (i.css({ "text-align": "right" }),
            0 < (r = o('a[href="collections/all"],input[name=update]')).length
              ? ((l = 'a[href="collections/all"],input[name=update]'),
                (c = r.first()),
                (p = "before"))
              : 0 <
                  (r = o(
                    'form[action^="/cart"]:not(form[action^="/cart/add"])'
                  )).length &&
                ((l = 'form[action^="/cart"]:not(form[action^="/cart/add"])'),
                (c = r.first())))),
        null !== c &&
          ("undefined" != typeof afterpay_cart_static_css &&
            i.css(afterpay_cart_static_css),
          i.attr(t),
          c[p](i)),
        0 != afterpay_variable_subtotal_fallback &&
          null !==
            (a =
              null ===
                (a =
                  "undefined" !=
                    typeof afterpay_variable_subtotal_fallback_selector &&
                  0 <
                    (r = o(afterpay_variable_subtotal_fallback_selector)).length
                    ? r.first()
                    : a) && null !== c
                ? c
                : a) &&
          (Afterpay.mutationObserver &&
          "mutation" == afterpay_variable_subtotal_fallback_method
            ? (i.attr("data-amount", a.text()),
              new Afterpay.mutationObserver(function (t, e) {
                (a = o(afterpay_variable_subtotal_fallback_selector).first()),
                  i.attr("data-amount", a.text()),
                  o("#" + s).length || o(l).first()[p](i);
              }).observe(document.body, {
                childList: !0,
                attributes: !1,
                characterData: !1,
                subtree: !0,
                attributeOldValue: !1,
                characterDataOldValue: !1,
              }))
            : setInterval(function (t) {
                (a = o(afterpay_variable_subtotal_fallback_selector).first()),
                  i.attr("data-amount", a.text()),
                  o("#" + s).length || o(l).first()[p](i);
              }, 400));
    },
    loadScript: function (t, e) {
      var a = document.createElement("script");
      (a.type = "text/javascript"),
        a.readyState
          ? (a.onreadystatechange = function () {
              ("loaded" != a.readyState && "complete" != a.readyState) ||
                ((a.onreadystatechange = null), e());
            })
          : (a.onload = function () {
              e();
            }),
        (a.src = t),
        document.getElementsByTagName("head")[0].appendChild(a);
    },
    supportedCurrencies: ["AUD", "NZD", "USD", "CAD"],
    supportedThemes: {
      alchemy: {
        product: {
          "2017-12-14": { selector: ".quadd-wrapper" },
          "2021-08-13": { selector: ".product-price" },
        },
        cart: {
          static_page: {
            "2021-08-13": {
              selector:
                "div.column.half.align-right.align-center-mobile > div.h2",
            },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer div.payment-methods__inner",
            logo_template:
              '<img class="payment-icon fade-in lazyloaded" alt="afterpay" src="{logo_path}">',
          },
        },
      },
      atlantic: {
        product: { "2017-12-14": { selector: "p.price" } },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-options",
            logo_template:
              '<li class="payment-icon"><object data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      blockshop: {
        product: {
          "2017-12-14": {
            selector: "article .prices",
            paragraph_css: { "margin-top": "-1em", "margin-bottom": "2em" },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons--list",
            logo_template:
              '<li class="payment-icons--item"><object data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      boundless: {
        product: {
          "2017-12-14": {
            selector: "#AddToCartForm-product-template .product__price",
            paragraph_css: { "margin-top": "0px" },
          },
        },
        cart: {
          static_page: { "2018-05-30": { selector: "span.cart__subtotal" } },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li><object class="payment-icons__icon" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      brooklyn: {
        product: {
          "2017-12-14": {
            selector: "#ProductPrice",
            logo_css: { border: "0px" },
          },
        },
        cart: {
          static_page: {
            "2018-05-30": {
              selector: ".cart__row--table:last",
              logo_css: { border: "0px" },
            },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li><object class="icon" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      classic: {
        product: {
          "2017-12-14": {
            selector: ".product-single__prices",
            paragraph_css: { "margin-top": "-15px", "margin-bottom": "30px" },
          },
        },
      },
      debutify: {
        product: {
          "2020-09-17": { selector: ".price-wrapper" },
          "2021-08-13": { selector: ".price-container" },
        },
        cart: {
          static_page: {
            "2020-09-17": {
              selector: ".cart__row--table:last",
              paragraph_css: { "text-align": "center" },
            },
            "2021-11-04": {
              selector: ".card-body > div.grid.grid-small.flex-nowrap",
              paragraph_css: { "text-align": "center" },
            },
            "2021-11-05": {
              selector: ".cart__total-price-info",
              paragraph_css: { "text-align": "center" },
            },
          },
        },
        footer: {
          "2020-09-17": {
            logo_container: ".payment-icons-list",
            logo_template:
              '<li><object class="payment-icons" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
          "2021-11-05": {
            logo_container: "footer .payment-icons ul",
            logo_template:
              '<li><object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      debut: {
        product: {
          "2017-12-14": {
            selector: ".product-single__price",
            paragraph_css: { "margin-top": "-20px", "margin-bottom": "40px" },
          },
          "2018-07-04": {
            selector: ".product__price",
            paragraph_css: { "margin-top": "-10px", "margin-bottom": "40px" },
          },
        },
        cart: {
          static_page: {
            "2018-05-30": { selector: ".cart__footer .cart__subtotal" },
            "2020-03-27": { selector: ".cart-subtotal" },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li class="payment-icon"><object class="icon icon--full-color" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      district: {
        product: {
          "2017-12-14": {
            selector: "#ComparePrice-product-template",
            paragraph_css: {
              "margin-top": "0.3rem",
              display: "block",
              "font-style": "normal",
            },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer .payment-types ul",
            logo_template:
              '<li><object class="payment-icon payment-icon--afterpay" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      empire: {
        product: {
          "2017-12-14": {
            selector: ".product--container .product-pricing",
            paragraph_css: {
              "line-height": "1.5",
              "margin-top": "10px",
              "margin-bottom": "22px",
            },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li class="payment-icons-item"><object data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      fashionopolism: {
        product: {
          "2017-12-14": { selector: ".product-prices" },
          "2018-08-10": { selector: "#product-price" },
        },
        cart: {
          static_page: { "2018-08-10": { selector: "#basket-right>h4" } },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer .sub-footer .right-side",
            logo_template: '<img src="{logo_path}" />',
          },
        },
      },
      flow: {
        product: {
          "2017-12-14": {
            selector: "#ProductPrice",
            paragraph_css: { "margin-top": "-20px", "margin-bottom": "30px" },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      grid: {
        product: {
          "2017-12-14": {
            selector: ".product-details .product-price",
            paragraph_css: { "margin-top": "-35px", "margin-bottom": "40px" },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer .site-footer-payment-types",
            logo_template:
              '<object data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      icon: {
        product: {
          "2017-12-14": {
            selector: "#product-price",
            paragraph_css: { "margin-top": "-20px" },
          },
        },
        cart: {
          static_page: { "2018-08-10": { selector: "#basket-right>h4" } },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer #payment",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      jumpstart: {
        product: {
          "2017-12-14": { selector: "#AddToCartForm .price:last" },
          "2018-05-30": { selector: "#ProductPrice-product-template" },
        },
        cart: {
          static_page: { "2018-05-30": { selector: "span.h3.cart__subtotal" } },
        },
      },
      minimal: {
        product: {
          "2017-12-14": {
            selector: ".product-single__prices",
            paragraph_css: { "margin-top": "-15px" },
          },
        },
        cart: {
          static_page: {
            "2018-05-30": { selector: ".h5.cart__subtotal" },
            "2020-02-26": { selector: ".cart__subtotal" },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li><object class="icon" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      modular: {
        product: {
          "2017-12-14": {
            selector: ".productForm .product-price",
            paragraph_css: { "margin-top": "-1rem", "margin-bottom": "1.5rem" },
          },
          "2020-06-03": { selector: ".product-normal-price" },
          "2020-09-21": { selector: ".product-price" },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icon-list",
            logo_template:
              '<li><object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      motion: {
        product: {
          "2017-12-14": {
            selector: ".product-single__meta .product__price:last",
          },
        },
        cart: {
          static_page: {
            "2018-05-30": {
              selector: ".grid--full.cart__row--table:last",
              paragraph_css: { "margin-top": "10px" },
            },
          },
        },
      },
      narrative: {
        product: {
          "2017-12-14": {
            selector: ".product__content .product__price",
            paragraph_css: { "margin-top": "0px", "text-align": "center" },
          },
        },
        cart: {
          static_page: {
            "2018-05-30": { selector: ".cart-footer .cart-footer__subtotal" },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li class="payment-icon"><object class="icon icon--full-color" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      pacific: {
        product: { "2017-12-14": { selector: ".product-price" } },
        footer: {
          "2020-02-07": {
            logo_container: "footer .payment-options",
            logo_template:
              '<object data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      parallax: {
        product: { "2017-12-14": { selector: ".modal_price" } },
        cart: {
          static_page: {
            "2018-05-31": {
              selector: "form .subtotal_amount",
              paragraph_css: { "font-size": "13px" },
            },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: ".footer .payment_methods",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      pipeline: {
        product: {
          "2017-12-14": {
            selector: "#ComparePriceWrapper-product",
            paragraph_css: {
              "margin-top": "15px",
              "line-height": "1.5",
              "letter-spacing": "0",
              "font-size": "14px",
              "text-transform": "none",
              color: "#000",
            },
          },
          "2018-08-10": { selector: "#productInfo-product .product__price" },
          "2021-08-13": { selector: ".product__price" },
        },
        cart: {
          static_page: {
            "2018-08-10": { selector: ".cart__footer__text:first" },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li><object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object><span class="visually-hidden">Afterpay</span></li>',
          },
        },
      },
      pop: {
        product: { "2017-12-14": { selector: ".product-single__price" } },
        cart: {
          static_page: { "2018-05-30": { selector: "span.cart__subtotal" } },
        },
      },
      prestige: {
        product: {
          "2018-07-27": { selector: ".ProductMeta__PriceList.Heading" },
        },
        cart: {
          static_page: {
            "2021-04-01": { selector: ".Cart__Total.Heading.u-h6" },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.Footer__PaymentList",
            logo_template:
              '<li class="HorizontalList__Item"><object data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      providence: {
        product: { "2017-12-14": { selector: ".pricing" } },
        footer: {
          "2020-02-07": {
            logo_container: "footer .payment-types",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      retina: {
        product: {
          "2017-12-14": {
            selector: ".modal_price",
            paragraph_css: { "margin-top": "-15px", "margin-bottom": "20px" },
          },
        },
        cart: {
          static_page: {
            "2018-08-10": {
              selector: "#cart_form .subtotal_amount",
              paragraph_css: { "font-size": "13px" },
            },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: ".footer .payment_methods",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      showcase: {
        product: {
          "2018-08-10": {
            selector: ".product-detail__title-and-price .price-area",
          },
          "2021-08-13": {
            selector: ".product-area__row",
            paragraph_css: { "text-align": "left" },
          },
        },
        cart: {
          static_page: { "2018-08-10": { selector: "#cartform .subtotal" } },
        },
        footer: {
          "2020-02-07": {
            logo_container: ".page-footer ul.payment-methods",
            logo_template:
              '<li><object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
          "2021-08-13": {
            logo_container: ".section-footer__payment-icons",
            logo_template:
              '<object class="section-footer__payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      showtime: {
        product: {
          "2017-12-14": {
            selector: ".desc_blk_bot .price",
            paragraph_css: {
              float: "none",
              clear: "both",
              "margin-bottom": "1rem",
              "text-align": "center",
            },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "#footer .partner ul.list-inline",
            logo_template:
              '<li><object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      simple: {
        product: {
          "2017-12-14": {
            selector: "#ProductSection .product-single__prices",
            paragraph_css: { "margin-top": "-15px", "margin-bottom": "30px" },
          },
        },
        cart: {
          static_page: { "2018-05-30": { selector: "span.cart__subtotal.h3" } },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li><object class="icon icon--full-color" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      supply: {
        product: { "2017-12-14": { selector: "ul.product-meta" } },
        cart: {
          static_page: {
            "2018-05-30": { selector: ".h1.cart-subtotal--price" },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li><object class="icon" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      symmetry: {
        product: {
          "2017-12-14": { selector: "#main-product-detail .price-area" },
          "2021-08-13": { selector: ".price-container" },
        },
        cart: { static_page: { "2021-08-13": { selector: ".subtotal" } } },
        footer: {
          "2020-02-07": {
            logo_container: "#pagefooter .payment-methods",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
          "2021-08-13": {
            logo_container: ".section-footer__payment-icons",
            logo_template:
              '<object class="section-footer__payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      testament: {
        product: { "2017-12-14": { selector: "#product-price" } },
        cart: {
          static_page: { "2018-08-10": { selector: "#basket-right>h4" } },
        },
        footer: {
          "2020-06-03": {
            logo_container: "footer #payment",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      turbo: {
        product: { "2018-08-10": { selector: ".modal_price" } },
        cart: {
          static_page: {
            "2018-08-10": { selector: "#cart_form .cart_subtotal" },
          },
        },
        footer: {
          "2020-06-03": {
            logo_container: ".payment_methods",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      venture: {
        product: {
          "2017-12-14": {
            selector: "ul.product-single__meta-list",
            paragraph_css: { "margin-top": "10px" },
          },
        },
        cart: { static_page: { "2018-05-30": { selector: "p#CartSubtotal" } } },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li><object class="icon icon--full-color" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      venue: {
        product: {
          "2017-12-14": {
            selector: "h3.product-single__price-text",
            paragraph_css: { "line-height": "1.5" },
          },
        },
        footer: {
          "2020-02-07": {
            logo_container: "footer ul.footer__icons-items",
            logo_template:
              '<li class="footer__icons-item"><object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      responsive: {
        product: {
          "2020-03-05": {
            selector: ".product_section p.modal_price",
            paragraph_css: { "margin-top": "-10px", "margin-bottom": "10px" },
          },
        },
        cart: {
          static_page: {
            "2020-03-05": { selector: "#cart_form > .columns.omega > h4" },
          },
        },
        footer: {
          "2020-03-05": {
            logo_container: "footer div.payment_methods",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      canopy: {
        product: { "2020-03-10": { selector: "#price" } },
        cart: {
          static_page: {
            "2020-03-10": { selector: "#cartform div.cart-subtotal" },
          },
        },
        footer: {
          "2020-03-10": {
            logo_container: "footer div.payment-methods",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      sunrise: {
        product: {
          "2020-03-26": {
            selector: ".product-details .product-price-wrap",
            paragraph_css: { "font-size": "16px" },
          },
        },
        footer: {
          "2020-03-26": {
            logo_container: "footer .payment-icons",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      impulse: {
        product: {
          "2020-04-06": { selector: ".product__price-savings" },
          "2022-07-08": { selector: ".product-block--price" },
        },
        cart: {
          static_page: {
            "2021-04-01": {
              selector: ".main-content .cart__item-sub.cart__item-row",
              paragraph_css: { "text-align": "center" },
            },
          },
        },
        footer: {
          "2020-04-06": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li class="icon--payment"><object class="icon icon--full-color" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
          "2022-07-08": {
            logo_container: "footer ul.payment-icons",
            logo_template:
              '<li class="icon--payment"><object data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      ella: {
        product: { "2020-06-03": { selector: ".prices" } },
        cart: {
          static_page: {
            "2020-06-03": {
              selector: ".total",
              paragraph_css: {
                "text-align": "center",
                "margin-bottom": "15px",
              },
            },
          },
        },
      },
      kingdom: {
        product: {
          "2020-06-03": { selector: ".product__price--original" },
          "2020-09-21": { selector: ".product__price--compare" },
        },
        cart: {
          static_page: {
            "2020-06-03": {
              selector: "#CartTotal",
              paragraph_css: { margin: "-5px 0 3px" },
            },
          },
        },
      },
      caros: {
        product: { "2020-06-03": { selector: ".total-price" } },
        cart: {
          static_page: {
            "2020-06-03": {
              selector: ".total",
              paragraph_css: { "text-align": "center" },
            },
          },
        },
      },
      furnitica: {
        product: { "2020-06-03": { selector: ".prices" } },
        cart: { static_page: { "2020-06-03": { selector: ".total-price" } } },
      },
      maker: {
        footer: {
          "2020-06-03": {
            logo_container: ".payment-icons--list",
            logo_template:
              '<li class="payment-icons--item"><object class="" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      molla: {
        product: {
          "2020-06-03": {
            selector: ".gf_product-prices",
            paragraph_css: { "margin-bottom": "20px" },
          },
        },
        cart: {
          static_page: {
            "2020-06-03": {
              selector: ".table-summary",
              paragraph_css: { "text-align": "center" },
            },
          },
        },
      },
      vantage: {
        cart: {
          static_page: { "2020-06-03": { selector: "#basket-right > h4" } },
        },
        footer: {
          "2020-06-03": {
            logo_container: ".payment-methods",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      envy: {
        product: { "2020-09-17": { selector: ".product-page--pricing" } },
        cart: {
          static_page: {
            "2020-09-17": {
              selector: ".cart-totals--wrapper",
              paragraph_css: { "text-align": "right" },
            },
          },
        },
        footer: {
          "2020-09-17": {
            logo_container: "#footer-payment-methods",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      vanisa: {
        product: {
          "2020-09-21": {
            selector: ".product-price",
            paragraph_css: { "margin-top": "-5px", "margin-bottom": "15px" },
          },
        },
        cart: {
          static_page: { "2020-09-21": { selector: ".total-checkout" } },
        },
      },
      streamline: {
        product: { "2020-09-21": { selector: ".product-single__prices" } },
        cart: {
          static_page: { "2021-04-01": { selector: ".h3.cart__subtotal" } },
        },
        footer: {
          "2020-09-21": {
            logo_container: ".payment-icons",
            logo_template:
              '<li class="icon--payment"><object class="icon icon--full-color" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      editions: {
        product: {
          "2020-09-21": { selector: ".product-details__price-container" },
        },
        footer: {
          "2020-09-21": {
            logo_container: ".payment-options",
            logo_template:
              '<object class="payment-icons" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      warehouse: {
        product: { "2020-09-21": { selector: ".product-form .price-list" } },
        cart: {
          static_page: {
            "2020-09-21": { selector: ".cart-recap__price-line" },
          },
        },
        footer: {
          "2020-09-21": {
            logo_container: ".payment-list",
            logo_template:
              '<object class="payment-list__item" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      broadcast: {
        product: { "2021-08-13": { selector: ".product__price__wrap" } },
        cart: {
          static_page: {
            "2021-08-13": {
              selector:
                "#MainContent > div > div > form > div.cart__inner > div.cart__aside > div:nth-child(4)",
            },
          },
        },
      },
      lorenza: {
        product: {
          "2021-08-13": {
            selector:
              "div.product__header:visible > div.product__price, div.product__mobile-header:visible > div.product__price",
          },
        },
        cart: {
          static_page: {
            "2021-08-13": {
              selector: "p.type-body-extra-large.type-heading-1-small.mt1.mb1",
            },
          },
        },
      },
      expression: {
        product: { "2021-08-13": { selector: ".product-price" } },
        footer: {
          "2021-08-13": {
            logo_container: ".cards",
            logo_template:
              '<object class="payment-icon" data="{logo_path}" type="image/svg+xml"></object>',
          },
        },
      },
      trademark: {
        product: { "2021-08-13": { selector: ".product__prices:visible" } },
        cart: {
          static_page: {
            "2021-08-13": { selector: "div.grid div > span.cart__total.h3" },
          },
        },
        footer: {
          "2021-08-13": {
            logo_container: ".footer__payment-methods",
            logo_template:
              '<li class="footer__payment-method"><object data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      elomus: {
        product: {
          "2021-08-13": {
            selector: ".gf_product-prices",
            paragraph_css: { "margin-bottom": "15px" },
          },
        },
      },
      dawn: {
        product: {
          "2021-11-05": { selector: ".product__info-container .no-js-hidden" },
        },
        cart: {
          static_page: {
            "2021-11-05": {
              selector: "div.totals",
              paragraph_css: { "text-align": "right" },
            },
          },
        },
        footer: {
          "2021-11-05": {
            logo_container: ".list-payment",
            logo_template:
              '<li class="list-payment__item"><object class="icon icon--full-color" data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
      artisan: {
        cart: { static_page: { "2021-12-10": { selector: ".cart_subtotal" } } },
      },
      expanse: {
        product: { "2022-07-08": { selector: ".product-block--price" } },
        cart: {
          static_page: {
            "2022-07-08": { selector: "#CartPageForm .cart__item--subtotal" },
          },
        },
        footer: {
          "2022-07-08": {
            logo_container: ".payment-icons",
            logo_template:
              '<li class="icon--payment"><object data="{logo_path}" type="image/svg+xml"></object></li>',
          },
        },
      },
    },
  },
  afterpay_js_include_version =
    ((Afterpay.versionCompare = function (t, e, a) {
      function o(t) {
        return (t = (t = ("" + t).replace(/[_\-+]/g, "."))
          .replace(/([^.\d]+)/g, ".$1.")
          .replace(/\.{2,}/g, ".")).length
          ? t.split(".")
          : [-8];
      }
      function r(t) {
        return t ? (isNaN(t) ? i[t] || -7 : parseInt(t, 10)) : 0;
      }
      var c,
        p,
        l = 0,
        i = {
          dev: -6,
          alpha: -5,
          a: -5,
          beta: -4,
          b: -4,
          RC: -3,
          rc: -3,
          "#": -2,
          p: 1,
          pl: 1,
        };
      for (
        t = o(t), e = o(e), p = Math.max(t.length, e.length), c = 0;
        c < p;
        c++
      )
        if (t[c] !== e[c]) {
          if (((t[c] = r(t[c])), (e[c] = r(e[c])), t[c] < e[c])) {
            l = -1;
            break;
          }
          if (t[c] > e[c]) {
            l = 1;
            break;
          }
        }
      if (!a) return l;
      switch (a) {
        case ">":
        case "gt":
          return 0 < l;
        case ">=":
        case "ge":
          return 0 <= l;
        case "<=":
        case "le":
          return l <= 0;
        case "===":
        case "=":
        case "eq":
          return 0 === l;
        case "<>":
        case "!==":
        case "ne":
          return 0 !== l;
        case "":
        case "<":
        case "lt":
          return l < 0;
        default:
          return null;
      }
    }),
    "1.8.3"),
  afterpay_js_locale =
    (void 0 === afterpay_product_integration_enabled &&
      (afterpay_product_integration_enabled = !0),
    void 0 === afterpay_cart_integration_enabled &&
      (afterpay_cart_integration_enabled = !(
        "USD" != afterpay_shop_currency &&
        !Afterpay.versionCompare(afterpay_js_snippet_version, "1.0.12", ">=")
      )),
    void 0 === afterpay_dynamic_cart_integration_enabled &&
      (afterpay_dynamic_cart_integration_enabled = !1),
    void 0 === afterpay_dynamic_cart_observer_target &&
      (afterpay_dynamic_cart_observer_target = "body"),
    void 0 === afterpay_variable_price_fallback &&
      (afterpay_variable_price_fallback =
        "undefined" != typeof afterpay_variable_price_fallback_selector),
    "undefined" == typeof afterpay_variable_price_fallback_method &&
      (afterpay_variable_price_fallback_method = "mutation"),
    void 0 === afterpay_variable_subtotal_fallback &&
      (afterpay_variable_subtotal_fallback =
        "undefined" != typeof afterpay_variable_subtotal_fallback_selector),
    "undefined" == typeof afterpay_variable_subtotal_fallback_method &&
      (afterpay_variable_subtotal_fallback_method = "mutation"),
    void 0 === afterpay_modal_open_icon && (afterpay_modal_open_icon = !0),
    void 0 === afterpay_hide_upper_limit && (afterpay_hide_upper_limit = !1),
    void 0 === afterpay_hide_lower_limit && (afterpay_hide_lower_limit = !0),
    void 0 === afterpay_logo_theme && (afterpay_logo_theme = "colour"),
    void 0 === afterpay_footer_logo_enabled &&
      (afterpay_footer_logo_enabled = !!Afterpay.versionCompare(
        afterpay_js_snippet_version,
        "1.0.5",
        ">="
      )),
    void 0 === afterpay_footer_logo_format &&
      (afterpay_footer_logo_format = "icon"),
    void 0 === afterpay_footer_logo_theme &&
      (afterpay_footer_logo_theme = "colour"),
    void 0 === afterpay_footer_logo_background &&
      (afterpay_footer_logo_background = "border"),
    (afterpay_js_language =
      void 0 === afterpay_js_language ? "en" : afterpay_js_language) +
      "_" +
      (afterpay_js_country =
        void 0 === afterpay_js_country
          ? afterpay_shop_currency.substr(0, 2)
          : afterpay_js_country));
void 0 === afterpay_msg_size && (afterpay_msg_size = "sm"),
  void 0 === afterpay_show_if_outside_limits &&
    (afterpay_show_if_outside_limits = !0),
  void 0 === afterpay_bold_amount && (afterpay_bold_amount = !0),
  void 0 === afterpay_product_collections &&
    (afterpay_product_collections = ""),
  void 0 === afterpay_cart_skus && (afterpay_cart_skus = ""),
  void 0 === afterpay_cart_collections && (afterpay_cart_collections = "");
const afterpay_placement_attrs = {
  "data-mpid": afterpay_shop_permanent_domain,
  "data-currency": afterpay_shop_currency,
  "data-platform": "shopify-snippet",
  "data-consumer-locale": afterpay_js_locale,
  "data-show-upper-limit": !afterpay_hide_upper_limit,
  "data-show-lower-limit": !afterpay_hide_lower_limit,
  "data-show-if-outside-limits": !!afterpay_show_if_outside_limits,
  "data-payment-amount-is-bold": !!afterpay_bold_amount,
  "data-size": afterpay_msg_size,
  "data-logo-type": "compact-badge",
};
("white" != afterpay_logo_theme && "black" != afterpay_logo_theme) ||
  ((afterpay_placement_attrs["data-logo-type"] = "lockup"),
  (afterpay_placement_attrs["data-lockup-theme"] = afterpay_logo_theme)),
  afterpay_modal_open_icon ||
    (afterpay_placement_attrs["data-modal-link-style"] = "more-info-text"),
  Afterpay.arrayContainsElement(
    Afterpay.supportedCurrencies,
    afterpay_shop_currency
  ) &&
    (window.addEventListener("Square.Marketplace.ready", function () {
      var t = Square.Marketplace.noConflict();
      (Afterpay.JsLib = t),
        "function" != typeof jQuery ||
        !Object.prototype.hasOwnProperty.call(jQuery, "fn") ||
        Afterpay.versionCompare(jQuery.fn.jquery, "3.0", "<") ||
        "function" != typeof jQuery.get
          ? Afterpay.loadScript(
              "../ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js",
              function () {
                (Afterpay.jQuery_3_4_1 = jQuery.noConflict(!0)),
                  Afterpay.init(Afterpay.jQuery_3_4_1);
              }
            )
          : Afterpay.init(jQuery);
    }),
    Afterpay.loadScript(
      "../js.squarecdn.com/square-marketplace.js",
      function () {}
    ));
