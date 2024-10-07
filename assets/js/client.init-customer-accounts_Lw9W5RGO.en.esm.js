import {
  _ as t,
  bT as e,
  bU as n,
  c0 as s,
  B as a,
  bV as i,
  c1 as o,
  at as r,
  bW as c,
  bX as u,
  b$ as l,
  b7 as d,
  aJ as m,
  D as p,
  bQ as h,
  be as b,
  bf as v,
  bR as f,
} from "./chunk.common_INJqqS6p.esm.js";
import {
  C as g,
  d as w,
  c as y,
} from "./client.login-button_C9IPdYM9.en.esm.js";
class E {
  constructor(t) {
    (this.emailInput = t), (this.passwordInput = this.findPasswordInput());
  }
  start() {
    var t;
    this.emailInput.addEventListener("input", this.trackEmailChange.bind(this)),
      null === (t = this.passwordInput) ||
        void 0 === t ||
        t.addEventListener("input", this.trackPasswordChange.bind(this));
  }
  stop() {
    var t;
    this.emailInput.removeEventListener("input", this.trackEmailChange),
      null === (t = this.passwordInput) ||
        void 0 === t ||
        t.removeEventListener("input", this.trackPasswordChange);
  }
  isFilledWithPasswordManager() {
    if (
      void 0 !== this.emailLastUpdated &&
      void 0 !== this.passwordLastUpdated
    ) {
      return Math.abs(this.emailLastUpdated - this.passwordLastUpdated) < 100;
    }
  }
  trackEmailChange(t) {
    this.emailLastUpdated = t.timeStamp;
  }
  trackPasswordChange(t) {
    this.passwordLastUpdated = t.timeStamp;
  }
  findPasswordInput() {
    var t;
    return null === (t = this.emailInput.form) || void 0 === t
      ? void 0
      : t.querySelector('input[type="password"]');
  }
}
function I() {
  return t(this, void 0, void 0, function* () {
    if (!e("initCustomerAccounts")) {
      n("initCustomerAccounts");
      try {
        if (s(window.location.pathname).endsWith("/account"))
          return void (function () {
            const t = o("analytics_trace_id");
            if (t) {
              new g({
                elementName: "shop-login-button",
                flowVersion: i.SignIn,
                analyticsTraceId: t,
              }).trackClassicCustomerAccountsAccountPageImpression();
            }
          })();
        !(function () {
          const t = r(),
            e = new g({
              elementName: "shop-login-button",
              flowVersion: i.SignIn,
              analyticsTraceId: t,
            }),
            n = new WeakMap();
          let s = null;
          const o = c({
            onVisible: f,
            onFallback: (t) => {
              t.addEventListener("focus", b, { once: !0 }),
                e.trackShopPayLoginWithSdkErrorEvents({
                  apiKey: "",
                  errorCode: "fallback_to_focus_event",
                  errorMessage:
                    "Fallback to focus event for classic customer accounts",
                });
            },
          });
          function b(t) {
            f(t.target);
          }
          function v(t, e) {
            var n, s;
            const a =
                null === (n = t.elements.namedItem("checkout_url")) ||
                void 0 === n
                  ? void 0
                  : n.value,
              i =
                null === (s = t.elements.namedItem("return_url")) ||
                void 0 === s
                  ? void 0
                  : s.value,
              o = new URLSearchParams(
                Object.assign(
                  Object.assign(
                    { analytics_trace_id: e },
                    a && { checkout_url: a }
                  ),
                  i && { return_url: i }
                )
              );
            return `${window.location.origin}/account/redirect?${o.toString()}`;
          }
          function f(o) {
            var r, c;
            const u = o.form;
            if (!u)
              return void a.notify(
                new Error("Email form missing for classic customer accounts")
              );
            n.has(o) &&
              (a.notify(new Error("Input listener already exists for input")),
              null === (r = n.get(o)) || void 0 === r || r.destroy(),
              n.delete(o));
            const l = document.createElement("input");
            (l.type = "hidden"),
              (l.name = "login_with_shop[analytics_trace_id]"),
              (l.value = t),
              u.appendChild(l);
            const b = new d("modalDismissed", !1);
            s ||
              ((s = (function (t) {
                let e,
                  n = !1;
                (e = document.querySelector("shop-login-button:not([action])")),
                  e ||
                    ((e = document.createElement("shop-login-button")),
                    e.setAttribute("hide-button", "true"),
                    (n = !0));
                e.setAttribute("client-id", ""),
                  e.setAttribute("action", "default"),
                  e.setAttribute("version", "2"),
                  e.setAttribute("flow-version", i.SignIn),
                  e.setAttribute(
                    "analytics-context",
                    p.ClassicCustomerAccounts
                  ),
                  e.setAttribute("analytics-trace-id", t),
                  e.setAttribute("disable-sign-up", "true"),
                  e.setAttribute("auto-open", "true"),
                  e.setAttribute("consent-challenge", ""),
                  Object.entries(h()).forEach(([t, n]) => {
                    const s = t.replace(/_/g, "-");
                    e.setAttribute(s, n);
                  }),
                  n && document.body.appendChild(e);
                return e;
              })(t)),
              e.trackClassicCustomerAccountsLoginPageImpression(),
              s.addEventListener("completed", () => {
                const e = v(u, t);
                window.location.assign(e);
              }),
              s.addEventListener("modalclosed", () => {
                b.set(!0);
              }));
            const f = new E(o);
            f.start(),
              null === (c = s.setPasswordManagerDetection) ||
                void 0 === c ||
                c.call(s, f),
              (s.email = o.value),
              n.set(
                o,
                new m(o, (t) => {
                  s.email = t;
                })
              );
          }
          u({ selector: l, onElementFound: (t) => o.observe(t) });
        })();
      } catch (t) {
        if ((t instanceof Error && a.notify(t), t instanceof C)) {
          new g({
            elementName: "shop-login-button",
            flowVersion: i.SignIn,
            analyticsTraceId: t.analyticsTraceId,
          }).trackShopPayLoginWithSdkErrorEvents({
            apiKey: "",
            errorCode: t.code,
            errorMessage: t.message,
          });
        }
      }
    }
  });
}
class C extends Error {
  constructor(t, e = r()) {
    super(t),
      (this.analyticsTraceId = e),
      (this.name = "InitCustomerAccountsError"),
      (this.code = "init_customer_accounts_error");
  }
}
b() &&
  (v({ bundle: "initCustomerAccounts", bundleLocale: "en" }),
  w(),
  y(),
  f("initCustomerAccounts", I));
//# sourceMappingURL=client.init-customer-accounts_Lw9W5RGO.en.esm.js.map
