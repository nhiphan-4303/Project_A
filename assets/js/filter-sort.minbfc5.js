"use strict";
var _createClass = (function () {
  function r(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(e, r.key, r);
    }
  }
  return function (e, t, n) {
    return t && r(e.prototype, t), n && r(e, n), e;
  };
})();
function _toConsumableArray(e) {
  if (Array.isArray(e)) {
    for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
    return n;
  }
  return Array.from(e);
}
function _possibleConstructorReturn(e, t) {
  if (!e)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return !t || ("object" != typeof t && "function" != typeof t) ? e : t;
}
function _inherits(e, t) {
  if ("function" != typeof t && null !== t)
    throw new TypeError(
      "Super expression must either be null or a function, not " + typeof t
    );
  (e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
  })),
    t &&
      (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t));
}
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
!(function (theme, $) {
  var SEARCH_EXCLUSIONS_FILTER =
      'NOT named_tags.search:":exclude" AND inventory_quantity > 0',
    SEARCH_TYPE = { INSTANT: "Instant search", DIRECT: "Direct search" };
  function init() {
    var e = document.querySelector(".js-collection-filter-sort"),
      t = document.querySelector(".site-header__search-wrapper"),
      n = document.querySelector(".js-search-page"),
      r = algoliasearch(theme.algolia.app_id, theme.algolia.api_key);
    e && new CollectionFilterSort(r, e),
      t && new QuickSearch(r, t),
      n && new SearchPage(r, n);
  }
  function pushResultsData(e, t, n) {
    if (
      !location.pathname.includes("/search") ||
      !window.dataLayer.find(function (e) {
        return "search" === e.event;
      })
    ) {
      var r =
        e === SEARCH_TYPE.INSTANT ? "INSTANT_SEARCH_RESULT" : "SEARCH_RESULT";
      (window.AP_SEARCH_TERM = t),
        (window.AP_SEARCH_TYPE = e),
        (window.AP_SEARCH_NUM = n.length),
        (window.AP_SEARCH_RESULT = n.length ? "Y" : "N"),
        (window.AP_SEARCH_PRDRESULT = n.map(function (e, t) {
          return {
            code: e.id,
            name: e.title,
            brand: e.vendor,
            index: t + 1,
            item_list_name: r,
            cate: e.product_type || void 0,
            apg_brand_code: e.sku.slice(0, 5),
            price: e.price,
            discount: (e.compare_at_price || e.price) - e.price,
            prdprice: e.compare_at_price || e.price,
          };
        })),
        dataLayer.push({ event: "search" });
    }
  }
  var CustomConnectorWidget =
    (_createClass(D, [
      {
        key: "getWidget",
        value: function () {
          return this.widget;
        },
      },
      {
        key: "render",
        value: function () {
          console.error("not implemented");
        },
      },
    ]),
    D);
  function D(e, t) {
    _classCallCheck(this, D);
    var n = instantsearch.connectors[e](this.render.bind(this));
    this.widget = n(t);
  }
  var LabeledRefinementList =
    (_inherits(K, CustomConnectorWidget),
    _createClass(K, [
      {
        key: "render",
        value: function (e, t) {
          var i = this,
            n = e.items,
            r = e.refine;
          t &&
            this.refinementContainer.addEventListener("change", function (e) {
              i.pagination_manager.resetPage(), r(e.target.value);
            });
          var a = n.map(function (e, t) {
            var n = ":" === e.label[0] ? e.label.substring(1) : e.label,
              r = "refinementItem-" + i.attribute + "-" + e.label + "-" + t;
            return (
              '<li class="filter-refinement">\n          <input id="' +
              r +
              '" type="checkbox" class="filter-refinement__input" name="' +
              i.name +
              '" value="' +
              e.value +
              '" ' +
              (e.isRefined ? "checked" : "") +
              '/>\n          <label for="' +
              r +
              '" class="filter-refinement__facet">' +
              n +
              "</label>\n        </li>"
            );
          });
          (this.refinementContainer.innerHTML = a.join("")),
            this.panel.clientHeight && (this.panel.style.height = "auto"),
            (this.panel.style.height = this.panel.scrollHeight + "px"),
            this.container.classList.toggle("is-disabled", !n.length);
        },
      },
    ]),
    K);
  function K(e, t) {
    _classCallCheck(this, K);
    var n = e.querySelector('[name="filter_group"]').value,
      r = _possibleConstructorReturn(
        this,
        (K.__proto__ || Object.getPrototypeOf(K)).call(
          this,
          "connectRefinementList",
          {
            container: e,
            attribute: n,
            limit: 200,
            operator: "or",
            sortBy: ["name:asc"],
          }
        )
      );
    return (
      (r.attribute = n),
      (r.name = e.dataset.refinementName),
      (r.pagination_manager = t),
      (r.refinementContainer = e.querySelector(".js-refinement-list")),
      (r.panel = e.querySelector("[data-accordion-panel]")),
      (r.container = e),
      r
    );
  }
  var Hits =
    (_inherits(ba, CustomConnectorWidget),
    _createClass(ba, [
      {
        key: "render",
        value: function (e) {
          var i = this,
            t = e.hits,
            r = e.results;
          if (r) {
            pushResultsData(SEARCH_TYPE.DIRECT, r.query, t);
            var n = t.map(function (n) {
              return $.get(
                "/products/" + n.handle + ".js",
                function (e) {
                  return e;
                },
                "json"
              )
                .then(function (e) {
                  var t = new theme.CollectionProductTile(
                    n,
                    e,
                    i.collection_handle,
                    e.variants
                  ).render();
                  return (
                    theme.products.update(e),
                    document.createRange().createContextualFragment(t)
                  );
                })
                .catch(function (e) {
                  return console.error(e);
                });
            });
            $.when.apply($, n).then(
              function () {
                for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
                  t[n] = arguments[n];
                0 === r._state.offset && (i.container.innerHTML = ""),
                  t.forEach(function (e, t) {
                    if (e) {
                      i.container.appendChild(e);
                      var n = i.container.lastChild,
                        r = new theme.QuickAdd(
                          n.querySelector(".js-quick-add")
                        );
                      r.initializeVariantSelector(),
                        r.toggle &&
                          new theme.AccordionToggle(
                            r.toggle,
                            JSON.parse(r.toggle.dataset.toggle)
                          ),
                        n.addEventListener("click", function (e) {
                          e.target.closest(
                            ".search__results .product-tile a"
                          ) &&
                            window.dataLayer.push({
                              event: "select_item",
                              prdInfo: window.AP_SEARCH_PRDRESULT[t],
                            });
                        });
                    }
                  }),
                  yotpo && yotpo.refreshWidgets();
              },
              function (e) {
                return console.error(e);
              }
            );
          }
        },
      },
    ]),
    ba);
  function ba(e, t) {
    _classCallCheck(this, ba);
    var n = _possibleConstructorReturn(
      this,
      (ba.__proto__ || Object.getPrototypeOf(ba)).call(this, "connectHits")
    );
    return (n.collection_handle = t), (n.container = e), n;
  }
  var Sort =
    (_inherits(Aa, CustomConnectorWidget),
    _createClass(Aa, [
      {
        key: "render",
        value: function (e, t) {
          var n = this,
            r = e.currentRefinement,
            i = e.refine;
          if (t) {
            var a = this.container.querySelector(
              '[name="sort_index"][value="' + r + '"]'
            );
            a && (a.checked = !0),
              this.container.addEventListener("change", function (e) {
                n.pagination_manager.resetPage(), i(e.target.value);
              });
          }
          (this.current_index.innerHTML = this.item_label_map[r]),
            this.container.classList.remove("is-open");
        },
      },
      {
        key: "getDefaultIndex",
        value: function () {
          return this.items[0].value;
        },
      },
    ]),
    Aa);
  function Aa(e, t) {
    _classCallCheck(this, Aa);
    var n = Array.from(e.querySelectorAll('[name="sort_index"]')).map(function (
        e
      ) {
        return { label: e.dataset.label, value: e.value };
      }),
      r = _possibleConstructorReturn(
        this,
        (Aa.__proto__ || Object.getPrototypeOf(Aa)).call(
          this,
          "connectSortBy",
          { items: n }
        )
      );
    return (
      (r.container = e),
      (r.items = n),
      (r.current_index = e.querySelector(".js-sort-current-index")),
      (r.item_label_map = n.reduce(function (e, t) {
        return (e[t.value] = t.label), e;
      }, {})),
      (r.pagination_manager = t),
      r
    );
  }
  var LoadMore =
    (_createClass(Ra, [
      {
        key: "init",
        value: function (e) {
          var t = this,
            n = e.helper;
          this.button.addEventListener("click", function (e) {
            e.preventDefault(),
              t.use_shopify
                ? t.pagination_manager.nextShopifyPage()
                : (t.pagination_manager.nextPage(), n.search());
          });
        },
      },
      {
        key: "render",
        value: function (e) {
          var t = e.results,
            n = e.state,
            r = t.nbHits <= n.offset + n.length;
          this.button.classList.toggle("is-disabled", r);
        },
      },
    ]),
    Ra);
  function Ra(e, t, n) {
    _classCallCheck(this, Ra),
      (this.button = e),
      (this.current_page = 0),
      (this.pagination_manager = t),
      (this.use_shopify = n);
  }
  var PaginationManager =
    (_createClass(db, [
      {
        key: "init",
        value: function (e) {
          var t = e.helper;
          (this.helper = t), this.resetPage();
        },
      },
      {
        key: "nextPage",
        value: function () {
          this.current_page++;
          var e = Math.max(this.current_page - 1, 0);
          this.helper.setQueryParameter(
            "offset",
            this.initial_offset + e * this.paginate_by
          ),
            this.helper.setQueryParameter("length", this.paginate_by);
        },
      },
      {
        key: "resetPage",
        value: function () {
          (this.current_page = 0),
            this.helper.setQueryParameter("offset", this.current_page),
            this.helper.setQueryParameter("length", this.initial_offset);
        },
      },
      {
        key: "nextShopifyPage",
        value: function () {
          this.current_page++,
            "function" == typeof this.load_shopify_page &&
              this.load_shopify_page();
        },
      },
    ]),
    db);
  function db(e, t) {
    _classCallCheck(this, db),
      (this.paginate_by = e),
      (this.initial_offset = this.paginate_by),
      (this.load_shopify_page = t);
  }
  var ItemCount =
    (_inherits(ob, CustomConnectorWidget),
    _createClass(ob, [
      {
        key: "render",
        value: function (e, t) {
          var n = e.nbHits;
          if (!t) {
            (this.container.dataset.count = n), (this.counter.innerHTML = n);
            var r = this.container.querySelector(".search__title");
            if (r && "/search" === window.location.pathname) {
              var i = window.document.title.split(" – ");
              i.shift(),
                i.unshift(r.innerText),
                (window.document.title = i.join(" – "));
            }
          }
        },
      },
    ]),
    ob);
  function ob(e) {
    _classCallCheck(this, ob);
    var t = _possibleConstructorReturn(
      this,
      (ob.__proto__ || Object.getPrototypeOf(ob)).call(this, "connectStats")
    );
    return (
      (t.container = e), (t.counter = e.querySelector(".js-item-counter")), t
    );
  }
  var QueryBox =
    (_inherits(yb, CustomConnectorWidget),
    _createClass(yb, [
      {
        key: "render",
        value: function (e, t) {
          var n = this,
            r = e.query,
            i = e.refine;
          t &&
            ((this.search_box.value = r),
            this.search_box.addEventListener("input", function () {
              return i(n.search_box.value);
            }));
        },
      },
    ]),
    yb);
  function yb(e) {
    _classCallCheck(this, yb);
    var t = _possibleConstructorReturn(
      this,
      (yb.__proto__ || Object.getPrototypeOf(yb)).call(this, "connectSearchBox")
    );
    return (t.search_box = e), t;
  }
  var QuickHits =
    (_inherits(Ib, CustomConnectorWidget),
    _createClass(Ib, [
      {
        key: "render",
        value: function (e) {
          var t = this,
            n = e.results;
          if (n && n.query && 0 !== n.query.length) {
            var r = n.hits.map(function (e) {
              return new theme.QuickSearchTile(e).render();
            });
            (this.container.innerHTML = r.join("")),
              window.clearTimeout(this.dataLayerDebounce),
              (this.dataLayerDebounce = window.setTimeout(function () {
                pushResultsData(SEARCH_TYPE.INSTANT, n.query, n.hits),
                  t.container
                    .querySelectorAll(".line-item")
                    .forEach(function (e, t) {
                      e.addEventListener("click", function () {
                        window.dataLayer.push({
                          event: "select_item",
                          prdInfo: window.AP_SEARCH_PRDRESULT[t],
                        });
                      });
                    });
              }, 1e3));
          }
        },
      },
    ]),
    Ib);
  function Ib(e) {
    _classCallCheck(this, Ib);
    var t = _possibleConstructorReturn(
      this,
      (Ib.__proto__ || Object.getPrototypeOf(Ib)).call(this, "connectHits")
    );
    return (t.container = e), (t.dataLayerDebounce = null), t;
  }
  var QuickSearchShow =
    (_inherits(Vb, CustomConnectorWidget),
    _createClass(Vb, [
      {
        key: "render",
        value: function (e, t) {
          var n = this,
            r = e.query;
          t &&
            (this.container.addEventListener("click", function (e) {
              return (n.last_click_event = e);
            }),
            document.addEventListener("click", function (e) {
              n.container.classList.toggle(
                "is-search-focus",
                e === n.last_click_event
              );
            })),
            this.container.classList.toggle("is-search-active", !!r),
            this.container.classList.add("is-search-focus");
        },
      },
    ]),
    Vb);
  function Vb(e) {
    _classCallCheck(this, Vb);
    var t = _possibleConstructorReturn(
      this,
      (Vb.__proto__ || Object.getPrototypeOf(Vb)).call(this, "connectStats")
    );
    return (t.container = e), t;
  }
  var SearchQuery =
    (_inherits(ec, CustomConnectorWidget),
    _createClass(ec, [
      {
        key: "render",
        value: function (e) {
          var t = e.query;
          this.container.innerText = t || "";
        },
      },
    ]),
    ec);
  function ec(e) {
    _classCallCheck(this, ec);
    var t = _possibleConstructorReturn(
      this,
      (ec.__proto__ || Object.getPrototypeOf(ec)).call(this, "connectStats")
    );
    return (t.container = e), t;
  }
  var SearchLink =
    (_inherits(lc, CustomConnectorWidget),
    _createClass(lc, [
      {
        key: "render",
        value: function (e) {
          var t = e.query,
            n = e.nbHits;
          t && 0 !== n
            ? this.container.setAttribute(
                "href",
                "/search?q=" + encodeURIComponent(t)
              )
            : this.container.setAttribute("href", "/collections/all");
        },
      },
    ]),
    lc);
  function lc(e) {
    _classCallCheck(this, lc);
    var t = _possibleConstructorReturn(
      this,
      (lc.__proto__ || Object.getPrototypeOf(lc)).call(this, "connectStats")
    );
    return (t.container = e), t;
  }
  var QueryRouter =
    (_createClass(sc, [
      { key: "init", value: function () {} },
      {
        key: "getWidgetState",
        value: function (e, t) {
          var n = t.searchParameters.query;
          return n && e.q !== n ? $.extend(!0, {}, e, { q: n }) : e;
        },
      },
      {
        key: "getWidgetSearchParameters",
        value: function (e, t) {
          var n = t.uiState.q;
          return n ? e.setQuery(n) : e;
        },
      },
    ]),
    sc);
  function sc() {
    _classCallCheck(this, sc);
  }
  var CurrentFilters =
    (_inherits(Fc, CustomConnectorWidget),
    _createClass(Fc, [
      {
        key: "render",
        value: function (e, t) {
          var n = e.items,
            a = e.refine;
          if (t) {
            var o =
              ".js-filter-remove, " +
              Array.from(this.container.classList)
                .map(function (e) {
                  return "." + e;
                })
                .join("");
            this.container.addEventListener("click", function (e) {
              var t = e.target.closest(o);
              if (t.classList.contains("js-filter-remove")) {
                var n = t.dataset,
                  r = n.attribute,
                  i = n.value;
                a({ type: "disjunctive", attribute: r, value: i });
              }
            });
          }
          var r = n
            .map(function (e) {
              return e.refinements
                .map(function (e) {
                  var t = e.attribute,
                    n = e.value,
                    r = e.label;
                  return (
                    '<div class="current-filter">\n            <span>' +
                    (":" === r[0] ? r.substring(1) : r) +
                    '</span>\n            <button class="current-filter__remove js-filter-remove" data-attribute="' +
                    t +
                    '" data-value="' +
                    n +
                    '">\n              <span class="current-filter__remove-label">' +
                    theme.locales.collections.remove +
                    "</span>\n              " +
                    theme.images.close_icon +
                    "\n            </button>\n          </div>"
                  );
                })
                .join("");
            })
            .join("");
          this.container.innerHTML = r;
        },
      },
    ]),
    Fc);
  function Fc(e) {
    _classCallCheck(this, Fc);
    var t = _possibleConstructorReturn(
      this,
      (Fc.__proto__ || Object.getPrototypeOf(Fc)).call(
        this,
        "connectCurrentRefinements"
      )
    );
    return (t.container = e), t;
  }
  var ClearAll =
    (_inherits(ad, CustomConnectorWidget),
    _createClass(ad, [
      {
        key: "render",
        value: function (e, t) {
          var n = e.hasRefinements,
            r = e.refine;
          t &&
            this.button.addEventListener("click", function () {
              return r();
            }),
            this.button.classList.toggle("is-active", n);
        },
      },
    ]),
    ad);
  function ad(e) {
    _classCallCheck(this, ad);
    var t = _possibleConstructorReturn(
      this,
      (ad.__proto__ || Object.getPrototypeOf(ad)).call(
        this,
        "connectClearRefinements"
      )
    );
    return (t.button = e), t;
  }
  var CollectionFilterSort = (function () {
      function CollectionFilterSort(e, t) {
        _classCallCheck(this, CollectionFilterSort),
          (this.collection_handle = t.dataset.collectionHandle);
        var n = parseInt(t.dataset.paginateBy) || 20,
          r = instantsearch.widgets.configure({
            filters: "collections:" + this.collection_handle,
          }),
          i = new PaginationManager(n, this.loadShopifyPage.bind(this));
        this.pagination_manager = i;
        var a = Array.from(t.querySelectorAll(".js-filter-refinement")).map(
          function (e) {
            return new LabeledRefinementList(e, i).getWidget();
          }
        );
        this.hits = new Hits(
          t.querySelector(".collection__products"),
          this.collection_handle
        );
        var o = this.hits.getWidget(),
          s = new ItemCount(t.querySelector(".js-item-count")).getWidget(),
          c = new Sort(t.querySelector(".js-sort-menu"), i),
          l = c.getWidget(),
          u = new LoadMore(t.querySelector(".js-collection-next-page"), i, !0);
        this.load_more = u;
        var h = new CurrentFilters(
            t.querySelector(".js-current-filters")
          ).getWidget(),
          d = new ClearAll(
            t.querySelector(".js-clear-refinements")
          ).getWidget(),
          f = instantsearch({
            indexName: c.getDefaultIndex(),
            searchClient: e,
            routing: !0,
          });
        f.addWidgets([r, i].concat(_toConsumableArray(a), [s, l, u, h, d])),
          f.start();
        var _ = !1;
        f.helper.on("search", function (e) {
          _ || ((_ = !0), (u.use_shopify = !1), f.addWidget(o));
        }),
          (this.max_shopify_pages = parseInt(
            this.hits.container.dataset.pages
          ));
      }
      return (
        _createClass(CollectionFilterSort, [
          {
            key: "loadShopifyPage",
            value: function loadShopifyPage() {
              var _this19 = this,
                next_page = this.pagination_manager.current_page + 1;
              this.max_shopify_pages < next_page ||
                $.get(
                  "/collections/" +
                    this.collection_handle +
                    "?page=" +
                    next_page +
                    "&view=ajax"
                ).then(function (response) {
                  var container = document.createElement("div");
                  container.innerHTML = response;
                  var tiles = container.querySelectorAll(".product-tile");
                  tiles.forEach(function (tile) {
                    _this19.hits.container.appendChild(tile);
                    var jsQuickAdd = tile.querySelector(".js-quick-add");
                    if (jsQuickAdd) {
                      var productDetails = tile.querySelector(
                        "script[data-product-js]"
                      );
                      if (productDetails) {
                        eval(productDetails.textContent);
                        var form = new theme.QuickAdd(jsQuickAdd);
                        form.initializeVariantSelector(),
                          form.toggle &&
                            new theme.AccordionToggle(
                              form.toggle,
                              JSON.parse(form.toggle.dataset.toggle)
                            );
                      }
                    }
                  }),
                    _this19.load_more.button.classList.toggle(
                      "is-disabled",
                      _this19.max_shopify_pages <= next_page
                    ),
                    yotpo && yotpo.refreshWidgets();
                });
            },
          },
        ]),
        CollectionFilterSort
      );
    })(),
    QuickSearch = function e(t, n) {
      _classCallCheck(this, e);
      var r = instantsearch.widgets.configure({
          hitsPerPage: 6,
          filters: SEARCH_EXCLUSIONS_FILTER,
        }),
        i = new QueryBox(n.querySelector('[name="q"]')).getWidget(),
        a = new QuickHits(n.querySelector(".js-quick-hits")).getWidget(),
        o = new QuickSearchShow(n).getWidget(),
        s = new SearchQuery(n.querySelector(".js-quick-query")).getWidget(),
        c = new ItemCount(n).getWidget(),
        l = new SearchLink(
          n.querySelector(".js-quick-search-link")
        ).getWidget(),
        u = instantsearch({
          indexName: theme.algolia.prefix + "products",
          searchClient: t,
        });
      u.addWidgets([r, i, a, o, s, c, l]), u.start();
    },
    SearchPage = function e(t, n) {
      _classCallCheck(this, e);
      var r = parseInt(n.dataset.paginateBy) || 20,
        i = instantsearch.widgets.configure({
          filters: SEARCH_EXCLUSIONS_FILTER,
        }),
        a = new PaginationManager(r, !1),
        o = new QueryRouter(),
        s = new Hits(n.querySelector(".js-hits")).getWidget(),
        c = new LoadMore(n.querySelector(".js-search-next-page"), a),
        l = new ItemCount(n).getWidget(),
        u = new Sort(n.querySelector(".js-sort-menu"), a),
        h = u.getWidget(),
        d = instantsearch({
          indexName: u.getDefaultIndex(),
          searchClient: t,
          routing: !0,
        });
      d.addWidgets([i, o, s, c, l, h, a]), d.start();
    };
  $(init);
})((window.theme = window.theme || {}), jQuery),
  (function (e) {
    var t =
      (_createClass(r, [
        {
          key: "close",
          value: function () {
            this.container.classList.remove("is-open");
          },
        },
        {
          key: "open",
          value: function () {
            this.container.classList.add("is-open");
          },
        },
        {
          key: "toggle",
          value: function () {
            this.container.classList.contains("is-open")
              ? this.close()
              : this.open();
          },
        },
      ]),
      r);
    function r(e) {
      var t = this;
      _classCallCheck(this, r), (this.container = e);
      var n = this.container.querySelector(".js-filter-menu-panel");
      Array.from(
        this.container.querySelectorAll(".js-filter-menu-toggle")
      ).forEach(function (e) {
        e.addEventListener("click", function (e) {
          (t.last_event = e), t.toggle();
        });
      }),
        n.addEventListener("click", function (e) {
          return (t.last_event = e);
        }),
        document.addEventListener("click", function (e) {
          e !== t.last_event && t.close();
        });
    }
    e(function () {
      document.querySelectorAll(".js-filter-menu").forEach(function (e) {
        return new t(e);
      });
    });
  })(jQuery);
