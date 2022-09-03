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
  var postsCarouselHtml = "snippets/posts-carousel-snippet.html";
  var postsHtml = "snippets/posts-snippet.html";
  var postsUrl = "https://irem-tarim-default-rtdb.firebaseio.com/Posts.json";

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
  };

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

  it.loadPesticideItemsForSearchEngine = function () {
    $ajaxUtils.sendGetRequest(pesticideItemUrl, it.searchEngine);
    return false;
  };

  it.loadPosts = function () {
    showLoading("#main-content");
    $('.carousel').carousel();
    $ajaxUtils.sendGetRequest(postsUrl, buildAndShowPostsHTML);
    window.history.pushState({}, "", "/posts");
    setPathName = window.location.pathname;
  }

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

  function buildAndShowPostsHTML(posts) {
    $ajaxUtils.sendGetRequest(postsHtml, function (postsHtml) {
      $ajaxUtils.sendGetRequest(postsCarouselHtml, function (postsCarouselHtml) {
        var postsViewHtml = buildPostsViewHtml(
          posts,
          postsCarouselHtml,
          postsHtml
        );
        insertHtml("#main-content", postsViewHtml);
      }, false);
    }, false);
    window.history.pushState({}, "", "/posts");
    setPathName = window.location.pathname;
  }

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
    pesticideItemsTitleHtml = insertProperty(
      pesticideItemsTitleHtml,
      "category",
      categoryPesticideItems[0]["category"]
    );
    pesticideItemsTitleHtml = insertProperty(
      pesticideItemsTitleHtml,
      "short_name",
      categoryPesticideItems[0]["short_name"]
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

  function buildPostsViewHtml(posts, postCarouselHtml, postsHtml) {
    var finalHtml = postCarouselHtml;
    finalHtml += "<section class='row'>";
    for(var i = 0; i < posts.length; i++) {
      var wordcount = 0;
      var html = postsHtml;  
      var short_name = posts[i]["short_name"];
      var header = posts[i]["header"];
      var content = posts[i]["content"];
      var type = posts[i]["type"];
      var briefContent = "";
      for(var j = 0; j < content.length; j++) {
        wordcount++;
        briefContent += content[j];
        if (wordcount == 500) {
          briefContent += "... <a href='#' style='color: blue;'>devamını oku >></a>";
          break;
        }
      }
      if(type == "img") {
        var post_component = "<img id='post-img' src='/posts/{{short_name}}.jpg' alt='post image'>";
        html = insertProperty(html, "post_component", post_component);
        if(content == "") {
          var image_box_style = "style='width: 100%; height: 100%; margin: 0;'";
          var display_none = "style='display: none;'";
          var post_tile_style = "style='padding-top: 0;'";
          html = insertProperty(html, "image_box_style", image_box_style);
          html = insertProperty(html, "h5_style", display_none);
          html = insertProperty(html, "content_style", display_none);
          html = insertProperty(html, "post_tile_style", post_tile_style);
        }
      }
      if(type == "mov") {
        var post_component = "<video id='post-video' width='auto' height='280' controls><source src='/posts/{{short_name}}.mov' type='video/mp4'></video>";
        html = insertProperty(html, "post_component", post_component);
        if(content == "") {
          var image_box_style = "style='width: 100%; height: 100%; margin: 0;'";
          var display_none = "style='display: none;'";
          var post_tile_style = "style='padding-top: 0;'";
          html = insertProperty(html, "image_box_style", image_box_style);
          html = insertProperty(html, "h5_style", display_none);
          html = insertProperty(html, "content_style", display_none);
          html = insertProperty(html, "post_tile_style", post_tile_style);
        }
      }
      html = insertProperty(html, "short_name", short_name);  
      html = insertProperty(html, "header", header);
      html = insertProperty(html, "content", briefContent);
      html = insertProperty(html, "modal_content", content);
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }

  function buildPesticideItemsAfterSearchViewHtml(
    categoryPesticideItems,
    founded,
    pesticideItemsTitleHtml,
    pesticideItemHtml
  ) {
    pesticideItemsTitleHtml = insertProperty(
      pesticideItemsTitleHtml,
      "category_name",
      categoryPesticideItems[0]["category_name"]
    );
    pesticideItemsTitleHtml = insertProperty(
      pesticideItemsTitleHtml,
      "category",
      categoryPesticideItems[0]["category"]
    );
    pesticideItemsTitleHtml = insertProperty(
      pesticideItemsTitleHtml,
      "short_name",
      categoryPesticideItems[0]["short_name"]
    );
    var finalHtml = pesticideItemsTitleHtml;
    if (founded[0] == "Arama sonucu bulunamadı.") {
      finalHtml += "<h5 class='text-center'>Aradığınız ürün bulunamadı.</h5>";
    }
    else {
      finalHtml += "<section class='row'>";
    for (var i = 0; i < categoryPesticideItems.length; i++) {
      for (var j = 0; j < founded.length; j++) {
        if (categoryPesticideItems[i]["name"] == founded[j]) {
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
    }
  }
    finalHtml += "</section>";
    }   
    return finalHtml;
  }

  window.addEventListener("popstate", () => {
    if (setPathName === "/categories") {
      if (document.getElementById("category").onclick === null) {
      }
      it.loadMainPage();
    }
    if (setPathName === "/items") {
      pesticideItemUrl =
        "https://irem-tarim-default-rtdb.firebaseio.com/Category-items-{{category}}.json";
      it.loadPesticideCategories();
    }
  });

  it.searchEngine = function (items) {
    var score = 0;
    var founded = [];
    var searchVal = document.getElementById("searchVal").value;
    for (var i = 0; i < items.length; i++) {
      for (var j = 0; j < items[i].name.length; j++) {
        if (searchVal.indexOf(items[i].name[j]) != -1) {
          score++;
        }
      }
      if (items[i].name == searchVal) {
        founded.push(items[i].name);
      } else if (items[i].name.indexOf(searchVal) != -1) {
        founded.push(items[i].name);
      } else if (items[i].name.length * 0.5 <= score) {
        founded.push(items[i].name);
      }
      score = 0;
    }
    if (founded.length == 0) {
      founded.push("Arama sonucu bulunamadı.");
    }
    $ajaxUtils.sendGetRequest(
      pesticideItemsTitleHtml,
      function (pesticideItemsTitleHtml) {
        $ajaxUtils.sendGetRequest(
          pesticideItemHtml,
          function (pesticideItemHtml) {
            var pesticdeItemsViewHtml = buildPesticideItemsAfterSearchViewHtml(
              items,
              founded,
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
  };

  global.$it = it;
})(window);
