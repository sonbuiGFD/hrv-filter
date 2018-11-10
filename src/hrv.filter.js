(function($, window) {
  var pluginName = "filter";
  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend(
      {},
      $.fn[pluginName].defaults,
      this.element.data(),
      options
    );

    this.sections = this.element.find("[filter-sections]");
    this.selected = this.element.find("[filter-selected]");
    this.sortby = this.element.find("[filter-sortby]");

    this.container = this.element.find("[filter-container]");
    this.btnLoadMore = this.element.find("[filter-btnload]");

    this.cur_page = parseInt(this.element.data("currentPage"), 10) || 1;
    this.total_page = parseInt(this.element.data("pageSize"), 10) || 0;

    this.id = this.element.data("id");
    this.handle = this.element.data("handle");
    this.viewData = this.element.data("view");
    this.viewPagesize = this.element.data("viewPageSize");
    this.query = "";

    if (this.handle && this.handle !== "all") {
      this.query = "/search?q=filter=((collectionid:product=" + this.id + ")";
    } else {
      this.query = "/search?q=filter=((collectionid:product>=0)";
    }
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      var options = this.options;

      that.btnLoadMore.on("click", function() {
        that.loadmore();
      });

      that.sortby.on("change", function() {
        that.triggerFilter();
      });

      that.sections.find("[filter-option]").on("change", function() {
        var section = $(this).parents("[filter-sections]");
        if (section.data("single")) {
          var checked = $(this).is(":checked");
          section.find("[filter-option]").prop("checked", false);
          $(this).prop("checked", true);
        }

        that.triggerFilter();
      });

      that.selected.on("click", ".filter-selected-remove", function() {
        var id = $(this).data("id");
        $("#" + id)
          .prop("checked", false)
          .trigger("change");
      });

      that.selected.on("click", ".filter-selected-clear", function() {
        that.sections.find("[filter-option]").prop("checked", false);
        that.triggerFilter();
      });

      that.element.on("click", "[filter-pagination]", function(e) {
        e.preventDefault();
        that.getProduct($(this).data("page") || 0);
      });
    },

    renderSelected: function() {
      var listSection = [],
        res = "",
        optionHtml = "";

      this.sections.each(function() {
        var inputs = $(this).find("[filter-option]");

        $.each(inputs, function(index, input) {
          if ($(input).is(":checked")) {
            listSection.push({
              label: $(input).data("label"),
              id: $(input).data("id")
            });
          }
        });
      });

      listSection.forEach(function(op) {
        optionHtml +=
          "<div class='filter-selected-item'>" +
          op.label +
          " <span class='filter-selected-remove' data-id='" +
          op.id +
          "' >X</span> </div>";
      });

      if (optionHtml !== "") {
        res =
          optionHtml + '<button class="filter-selected-clear"> hủy </button>';
      }

      this.selected.html(res);
    },

    genQuery: function() {
      var listSection = [],
        _query = "",
        parrams = "";

      this.sections.each(function() {
        var selectedOptions = "";
        var inputs = $(this).find("[filter-option]");

        $.each(inputs, function(index, input) {
          if ($(input).is(":checked")) {
            selectedOptions += $(input).val() + "||";
          }
        });

        listSection.push(selectedOptions);
      });

      listSection.forEach(function(section) {
        if (section) {
          section += "#";
          section = section.replace("||#", "");
          parrams += "&&(" + section + ")";
        }
      });

      _query = this.query + parrams + ")";

      return _query;
    },

    getProduct: function(page) {
      var that = this;
      var url =
        that.genQuery() +
        "&view=" +
        that.viewData +
        "&sortby=" +
        that.sortby.val() +
        "&page=" +
        page;

      $.ajax({
        url: url,
        method: "get",
        success: function(data) {
          that.container.html(data);
        },
        error: function(err) {
          console.error("getProduct", err);
        }
      });
    },

    getPageSize: function() {
      var that = this;
      var url = that.genQuery() + "&view=" + that.viewPagesize;

      $.ajax({
        url: url,
        method: "get",
        success: function(data) {
          that.element.data("pageSize", parseInt(data, 10));
          that.element.data("currentPage", 1);
        },
        error: function(err) {
          console.error("getPageSize", err);
        }
      });
    },

    triggerFilter: function() {
      var that = this;
      that.btnLoadMore.removeClass("hidden");
      that.getPageSize();
      that.getProduct(0);
      that.renderSelected();
    },

    loadmore: function() {
      var that = this;
      if (that.total_page > that.cur_page) {
        that.cur_page++;

        var url =
          that.genQuery() +
          "&view=" +
          that.viewData +
          "&sortby=" +
          that.sortby.val() +
          "&page=" +
          that.cur_page;

        $.ajax({
          url: url,
          method: "get",
          success: function(data) {
            that.container.append(data);
            if (that.total_page == that.cur_page) {
              that.btnLoadMore.addClass("hidden");
            } else {
              that.btnLoadMore.removeClass("hidden");
            }
          }
        });
      } else {
        that.btnLoadMore.addClass("hidden");
      }
    },

    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {};

  $(function() {
    $("[data-" + pluginName + "]")[pluginName]();
  });
})(jQuery, window);
