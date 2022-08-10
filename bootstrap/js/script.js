$(function () {
  $(".navbar-toggler").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 992) {
      $("#navbarSupportedContent").collapse("hide");
    }
  });
});

(function (global) {
  var it = {};
  var setPathName = window.location.pathname;
  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl =
    "https://irem-tarim-default-rtdb.firebaseio.com/Categories.json";
  var categoriesTitleHtml = "snippets/pesticides-title-snippet.html";
  var categoryHtml = "snippets/pesticides-snippet.html";
  var pesticideItemUrl =
    "https://irem-tarim-default-rtdb.firebaseio.com/Category-items-{{category}}.json";
  var pesticideItemsTitleHtml =
    "snippets/single-category-pesticides-title-snippet.html";
  var pesticideItemHtml = "snippets/single-category-pesticides-snippet.html";

  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html +=
      "<img width'100px' height='100px' style='margin: 100px' src='bootstrap/images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  var switchNavButtonToActive = function () {
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("list-group-item active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    classes = document.querySelector("#navPesticideButton").className;
    if (classes.indexOf("active") == -1) {
      classes += " list-group-item active";
      document.querySelector("#navPesticideButton").className = classes;
    }
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (responseText) {
        document.querySelector("#main-content").innerHTML = responseText;
      },
      false
    );
  });

  it.loadPesticideCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
  };

  it.loadPesticideItems = function (category) {
    showLoading("#main-content");
    pesticideItemUrl = insertProperty(pesticideItemUrl, "category", category);
    $ajaxUtils.sendGetRequest(pesticideItemUrl, buildAndShowPesticideItemsHTML);
  };

  it.loadMainPage = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (homeHtml) {
        insertHtml("#main-content", homeHtml);
      },
      false
    );
    window.history.pushState({}, "", "/index");
    setPathName = window.location.pathname;
  };

  function buildAndShowCategoriesHTML(categories) {
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            var categoriesViewHtml = buildCategoriesViewHtml(
              categories,
              categoriesTitleHtml,
              categoryHtml
            );
            insertHtml("#main-content", categoriesViewHtml);
            switchNavButtonToActive();
          },
          false
        );
      },
      false
    );
    window.history.pushState({}, "", "/categories");
    setPathName = window.location.pathname;
   // console.log("I am in categories load and window is changed to " + window.location.pathname);
  }

  function buildAndShowPesticideItemsHTML(categoryPesticideItems) {
    $ajaxUtils.sendGetRequest(
      pesticideItemsTitleHtml,
      function (pesticideItemsTitleHtml) {
        $ajaxUtils.sendGetRequest(
          pesticideItemHtml,
          function (pesticideItemHtml) {
            var pesticdeItemsViewHtml = buildPesticideItemsViewHtml(
              categoryPesticideItems,
              pesticideItemsTitleHtml,
              pesticideItemHtml
            );
            insertHtml("#main-content", pesticdeItemsViewHtml);
          },
          false
        );
      },
      false
    );
    window.history.pushState({}, "", "/items");
    setPathName = window.location.pathname;
  }

  window.addEventListener('popstate', () => {
    if (setPathName === "/categories") {
      document.getElementById('category').onclick = function () {
        it.loadPesticideItems();
        window.history.replaceState(null, '', '/items');
      };
      window.history.replaceState(null, '', '/index');
      it.loadMainPage();
    }
    if (setPathName === "/items") {
      window.history.replaceState(null, '', '/categories');
      pesticideItemUrl =
            "https://irem-tarim-default-rtdb.firebaseio.com/Category-items-{{category}}.json";
          it.loadPesticideCategories();
    }
    if (setPathName === "/index") {
      window.history.replaceState(null, '', '/index');
    }
  })

  function buildCategoriesViewHtml(
    categories,
    categoriesTitleHtml,
    categoryHtml
  ) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    for (var i = 0; i < categories.length; i++) {
      var html = categoryHtml;
      var name = "" + categories[i]["name"];
      var short_name = categories[i]["short_name"];
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }

  function buildPesticideItemsViewHtml(
    categoryPesticideItems,
    pesticideItemsTitleHtml,
    pesticideItemHtml
  ) {
    pesticideItemsTitleHtml = insertProperty(
      pesticideItemsTitleHtml,
      "category_name",
      categoryPesticideItems[0]["category_name"]
    );
    var finalHtml = pesticideItemsTitleHtml;
    finalHtml += "<section class='row'>";
    for (var i = 0; i < categoryPesticideItems.length; i++) {
      var html = pesticideItemHtml;
      var name = "" + categoryPesticideItems[i]["name"];
      var short_name = categoryPesticideItems[i]["short_name"];
      var category_name = categoryPesticideItems[i]["category_name"];
      var description = categoryPesticideItems[i]["description"];
      var category = categoryPesticideItems[i]["category"];
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      html = insertProperty(html, "category_name", category_name);
      html = insertProperty(html, "description", description);
      html = insertProperty(html, "category", category);
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }

  global.$it = it;
})(window);
