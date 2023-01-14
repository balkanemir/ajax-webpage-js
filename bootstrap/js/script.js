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
  var setpathname = window.location.pathname;
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
  var aboutHtml = "snippets/about-snippet.html";
  var aboutUrl = "https://irem-tarim-default-rtdb.firebaseio.com/About.json";

  //PROPERTIES
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

  var switchNavButtonToActive = function (active_id) {
    let allButtons = ["#navHomeButton" , "#navPesticideButton", "#navPhotoButton", "#navAboutButton"];
    allButtons = allButtons.filter(item => item !== active_id);
    for(var i = 0; i < allButtons.length; i++) {
      var classes = document.querySelector(allButtons[i]).className;
      classes = classes.replace(new RegExp("list-group-item active", "g"), "");
      document.querySelector(allButtons[i]).className = classes;
    }
    classes = document.querySelector(active_id).className;
    if (classes.indexOf(active_id) == -1) {
      classes += " list-group-item active";
      document.querySelector(active_id).className = classes;
    }
  };
  //END PROPERTIES

  //LOADS
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
        switchNavButtonToActive("#navHomeButton");
      },
      false
    );
    window.history.pushState({}, "", "/index");
    setpathname = window.location.pathname;
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
    setpathname = window.location.pathname;
  }

  it.loadAbout = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(aboutUrl, buildAndShowAboutHTML);
    window.history.pushState({}, "", "/about");
    setpathname = window.location.pathname;
  }
  //END LOADS


  //BUILD AND SHOW HTMLS
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
            switchNavButtonToActive("#navPesticideButton");
          },
          false
        );
      },
      false
    );
    window.history.pushState({}, "", "/categories");
    setpathname = window.location.pathname;
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
    setpathname = window.location.pathname;
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
        switchNavButtonToActive("#navPhotoButton");
      }, false);
    }, false);
    window.history.pushState({}, "", "/posts");
    setpathname = window.location.pathname;
  }

  function buildAndShowAboutHTML(people) {
    $ajaxUtils.sendGetRequest(aboutHtml, function(aboutHtml) {
      var aboutViewHtml = buildAboutViewHTML(
        people,
        aboutHtml
      );
      insertHtml("#main-content", aboutViewHtml);
      switchNavButtonToActive("#navAboutButton");
    }, false);
  }
  //END BUILD AND SHOW HTMLS

  //BUILD VIEW HTML
  function buildCategoriesViewHtml(
    categories,
    categoriesTitleHtml,
    categoryHtml
  ) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    for (var i = 0; i < categories.length; i++) {
      var html = categoryHtml;
      var NAME = "" + categories[i]["NAME"];
      html = insertProperty(html, "NAME", NAME);
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
      "TYPE",
      categoryPesticideItems[0][0]["TYPE"]
    );
    var finalHtml = pesticideItemsTitleHtml;
    finalHtml += "<section class='row'>";
    for (var i = 0; i < categoryPesticideItems[0].length; i++) {
      var html = pesticideItemHtml;
      var NAME = "" + categoryPesticideItems[0][i]["NAME"];
      var TYPE = categoryPesticideItems[0][i]["TYPE"];
      html = insertProperty(html, "NAME", NAME.toUpperCase());
      html = insertProperty(html, "TYPE", TYPE);
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
        var post_component = "<img id='post-img' src='/posts/{{short_name}}.jpeg' alt='post image'>";
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
      "TYPE",
      categoryPesticideItems[0][0]["TYPE"]
    );
    var finalHtml = pesticideItemsTitleHtml;
    if (founded[0] == "Arama sonucu bulunamadı.") {
      finalHtml += "<h5 class='text-center'>Aradığınız ürün bulunamadı.</h5>";
    }
    else {
      finalHtml += "<section class='row'>";
    for (var i = 0; i < categoryPesticideItems[0].length; i++) {
      for (var j = 0; j < founded.length; j++) {
        if (categoryPesticideItems[0][i]["NAME"] == founded[j]) {
          var html = pesticideItemHtml;
          var NAME = "" + categoryPesticideItems[0][i]["NAME"];
          var TYPE = categoryPesticideItems[0][i]["TYPE"];
          html = insertProperty(html, "NAME", NAME);
          html = insertProperty(html, "TYPE", TYPE);
          finalHtml += html;
        }
    }
  }
    finalHtml += "</section>";
    }   
    return finalHtml;
  }

  function buildAboutViewHTML(people, aboutHtml) {
    var finalHtml = "<section class='row'>";
    for(var i = 0; i < people.length; i++) {
      var html = aboutHtml;
      var name = "" + people[i]["name"];
      var surname = people[i]["surname"];
      var profile = people[i]["profile"];
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "surname", surname);
      html = insertProperty(html, "profile", profile);
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }
  // END BUILD VIEW HTML

  // POPSTATE
  window.addEventListener("popstate", () => {
    if (setpathname === "/categories") {
      if (document.getElementById("category").onclick === null) {
      }
      it.loadMainPage();
    }
    if (setpathname === "/items") {
      pesticideItemUrl =
        "https://irem-tarim-default-rtdb.firebaseio.com/Category-items-{{category}}.json";
      it.loadPesticideCategories();
    }

    // if (setpathname === "/posts") {
    //   it.loadMainPage();
    // }

    //if (setpathname === "/about") {
     // it.loadMainPage();
    //}
  });
  // END POPSTATE

  // SEARCH ENGINE
  it.searchEngine = function (items) {
    var score = 0;
    var founded = [];
    var searchVal = document.getElementById("searchVal").value.toUpperCase();
    for (var i = 0; i < items[0].length; i++) {
      for (var j = 0; j < items[0][i].NAME.length; j++) {
        if (searchVal.indexOf(items[0][i].NAME[j]) != -1) {
          score++;
        }
      }
      if (items[0][i].NAME == searchVal) {
        founded.push(items[0][i].NAME);
      } else if (items[0][i].NAME.indexOf(searchVal) != -1) {
        founded.push(items[0][i].NAME);
      } else if (items[0][i].NAME.length * 0.5 <= score) {
        founded.push(items[0][i].NAME);
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
  //END SEARCH ENGINE

  global.$it = it;
})(window);
