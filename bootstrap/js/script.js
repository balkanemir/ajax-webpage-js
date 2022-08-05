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

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://irem-tarim-default-rtdb.firebaseio.com/Categories.json";
  var categoriesTitleHtml = "snippets/pesticides-title-snippet.html";
  var categoryHtml = "snippets/pesticides-snippet.html";

  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img width'100px' height='100px' style='margin: 100px' src='bootstrap/images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    console.log(propToReplace);
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (responseText) {
        document.querySelector("#main-content").innerHTML = responseText;
      },
      false);
  });

  it.loadPesticideCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
  };

  function buildAndShowCategoriesHTML (categories) {
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            var categoriesViewHtml = buildCategoriesViewHtml(categories, 
              categoriesTitleHtml,categoryHtml);
              insertHtml("#main-content", categoriesViewHtml);
          }, false);
      },
      false);
  }

  function buildCategoriesViewHtml(categories,categoriesTitleHtml, categoryHtml) {
  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  for(var i = 0; i < categories.length; i++) {
    var html = categoryHtml;
    var name = "" + categories[i]["name"];
    var short_name = categories[i]["short_name"]; 
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name",short_name);
    finalHtml += html;
  }
  finalHtml += "</section>";
  return finalHtml;
  }
  global.$it = it;
})(window);
