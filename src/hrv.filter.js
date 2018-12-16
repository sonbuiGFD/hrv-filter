(function($, window) {
  var pluginName = "filter-nod";
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
		this.type = this.element.data("type") || 'collectionid:product';
    this.viewData = this.element.data("view");
    this.viewPagesize = this.element.data("viewPageSize");

    this.sidebar = this.element.data("sidebar");
	

    this.query = "";

		this.resultsSize = this.element.find("[filter-results-size]");
		this.searchQuery = this.element.find("[filter-query]");
		this.q = "";
		this.trigger = this.element.find("[filter-trigger]");

	if(this.sidebar && this.sidebar !== '') {
			this.sections = $(this.sidebar).find("[filter-sections]");
			this.searchQuery = $(this.sidebar).find("[filter-query]");
			this.trigger = $(this.sidebar).find("[filter-trigger]");
		}


    if (this.handle && this.handle !== "all") {
			this.query = "filter=(("+ this.type +"=" + this.id + ")";
    } else {
			this.query = "filter=(("+ this.type +">=0)";
    }
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      var options = this.options;
			
			// trigger loadmore
      that.btnLoadMore.on("click", function() {
        that.loadmore();
      });
			
			//trigger change option
      that.sortby.on("change", function() {
        that.triggerFilter();
      });

      that.sections.find("[filter-option]").on("change", function() {
        var section = $(this).parents("[filter-sections]");
        if (section.data("single")) {
          var checked = $(this).is(":checked");
          section.find("[filter-option]").prop("checked", false);
          $(this).prop("checked", checked);
        }

        that.triggerFilter();
      });
			
			// remove selected
      that.selected.on("click", ".filter-selected-remove", function() {
        var id = $(this).data("id");
        $("#" + id)
          .prop("checked", false);

          that.triggerFilter();
      });

      that.selected.on("click", ".filter-selected-clear", function() {
        that.sections.find("[filter-option]").prop("checked", false);
        that.triggerFilter();
      });

			// trigger pagination
      that.element.on("click", "[filter-pagination]", function(e) {
        e.preventDefault();
        that.getProduct($(this).data("page") || 0);
      });

			// update filter q
			that.trigger.on('click', function() {
				that.q = that.searchQuery.val() || "";
				that.getProduct(0);
			});
			
			that.searchQuery.on('blur', function() {
				that.q = that.searchQuery.val() || "";
				that.getProduct(0);
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

				this.selected.removeClass("filtered");
      if (optionHtml !== "") {
				this.selected.addClass("filtered");
        res =
          optionHtml + '<button class="filter-selected-clear"> Xóa hết </button>';
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
				'/search?q=' +
					(that.q && that.q !== '' ? (that.q + '&') : '') +
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
					var size = that.container.find('[data-filter-size]').data('filterSize');
					that.resultsSize.html(size)
        },
        error: function(err) {
          console.error("getProduct", err);
        }
      });
    },

    getPageSize: function() {
      var that = this;
      var url = '/search?q=' + 
					(that.q && that.q !== '' ? (that.q + '&') : '') +
					that.genQuery() + "&view=" + that.viewPagesize;

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
					'/search?q=' +
					(that.q && that.q !== '' ? (that.q + '&') : '') +
          that.genQuery() +
          "&view=" +
          that.viewData +
						that.sortby.length ?("&sortby=" + that.sortby.val()) : ''+
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