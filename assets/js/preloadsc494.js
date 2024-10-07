
    (function() {
      var baseURL = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/polyfills-legacy.DDNJZanH.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/app-legacy.DoGTh__F.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/VaultedContact-legacy.DUpMJfVd.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/DeliveryMethodSelectorSection-legacy.CteMQrgk.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/useUnauthenticatedErrorModal-legacy.DBdVauvK.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/RageClickCapture-legacy.C1j9VGMU.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/ShopPayLogo-legacy.DkPU9Bjp.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/PurchaseOptionsAgreement-legacy.BB-nq2Pf.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/Option-legacy.CLy2hTaC.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/PickupPointCarrierLogo-legacy.BQnGAMw1.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/hooks-legacy.BoiG1NNg.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/LegacyVaultedShippingMethods-legacy.uBtXlgz2.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/OnePageModal-legacy.B0Itg3ID.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/Rollup-legacy.BccBph4T.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/useShowShopPayOptin-legacy.Ds1409Pf.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/Section-legacy.BTwCY55R.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/google-pay-legacy.Bdc_vQRY.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/PayButtonSection-legacy.4eDd-QlB.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/context-legacy.D8i20mbo.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/constants-legacy.DUY12ltR.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/ButtonWithRegisterWebPixel-legacy.CZ4OGLsz.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/NoAddressLocationFullDetour-legacy.BvDdt1Lt.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/publishMessage-legacy.Chlgih7P.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/DutyOptions-legacy.C4rpThqM.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/SubscriptionPriceBreakdown-legacy.cNLCgHVC.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/StockProblemsLineItemList-legacy.SDxSR9oI.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/component-ShopPayVerificationSwitch-legacy.ZkOsaDIw.js"];
      var styles = [];
      var fontPreconnectUrls = ["https://fonts.shopifycdn.com"];
      var fontPrefetchUrls = ["https://fonts.shopifycdn.com/inter/inter_n4.481bd4d19704ca98fb1d3abd50c668b6962860a2.woff2?h1=dXMuc3Vsd2hhc29vLmNvbQ&hmac=1d53e4bef6aa7433281d1d634a9c999e142833fee7df7984af2904e76cc8a67c","https://fonts.shopifycdn.com/inter/inter_n7.50ef4139896edec0637fde057914fbf7e3a8d56e.woff2?h1=dXMuc3Vsd2hhc29vLmNvbQ&hmac=3ccfe917e15e685ff56387fd54a62da38c20496588683ca34b4bf7c4e90ccfec"];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0249/8399/4413/files/SWS_Site_logo_Amber_x320.png?v=1677003283"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [baseURL].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        })();
      }

      function onLoaded() {
        preconnectAssets();
        prefetchAssets();
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  