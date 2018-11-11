# hrv-filter

Plugin filter list product for haravan

**include file hrv.filter.min.js before close body tag**

```sh
{{ 'hrv.filter.min.js' | asset_url | script_tag }}
```

**Create file search.data.liquid and search.pagesize.liquid**

```sh
{% layout none %}
<ul>
{% for product in search.results %}
    <div class="product-grid-item">
    ...
    </div>
{% endfor %}
</ul>
```

```sh
{% layout none %}
{%paginate search.results by settings.collections_page_limit %}{{paginate.pages}}{%endpaginate%}
```

**Add custom attribut to element**

##### Colection container

```sh
{% paginate collection.products by settings.collections_page_limit %}
    <div class="container"
        data-filter
        data-current-page="{{paginate.current_page}}"
        data-page-size="{{paginate.pages}}"
        data-id="{{collection.id}}"
        data-handle="{{collection.handle}}"
        data-view="datagrid"
        data-view-page-size="pagesize"
    >
    ...
    </div>
{% endpaginate %}
```

##### block filter option

###### multi options

```sh
<ul filter-sections >
    {% for vendor in shop.vendors %}
        {% unless vendor == 'Khác' %}
        <li>
            <input
                id="filer-vendor-{{ forloop.index }}"
                type="checkbox"
                name="filer-vendor-{{ forloop.index }}"
                value="(vendor:product**{{vendor}})"
                filter-option
                data-label="{{ vendor }}"
                data-id="filer-vendor-{{ forloop.index }}"
            >
            <label for="filer-vendor-{{ forloop.index }}">{{ vendor }}</label>
        </li>
        {% endunless %}
    {% endfor %}
    <li>
        <input
            filter-option
            data-label="Khác"
            data-id="filer-vendor-khac"
            id="filer-vendor-khac"
            type="checkbox"
            name="filer-vendor-khac"
            value="(vendor:product**Khác)"
        >
        <label for="filer-vendor-khac">Khác</label>
    </li>
</ul>
```

###### single option

```sh
<ul filter-sections data-single="true">

    <li>
        <input
            id="filter-price-1"
            name="price"
            type="checkbox"
            value="(price:product>=0)"
            filter-option
            data-label="Tất Cả"
            data-id="filter-price-1"
        >
        <label for="filter-price-1">
            <span>Tất Cả</span>
        </label>
    </li>

    <li>
        <input
            id="filter-price-2"
            name="price"
            type="checkbox"
            value="(price:product>=0)&amp;&amp;(price:product<100000)"
            filter-option
            data-label="0 Đ ~ 100.000 Đ"
            data-id="filter-price-2"
        >
        <label for="filter-price-2">
            <span>0 Đ ~ 100.000 Đ</span>
        </label>
    </li>

    <li>
        <input
            id="filter-price-3"
            name="price"
            type="checkbox"
            value="(price:product>=100000)&amp;&amp;(price:product<200000)"
            filter-option
            data-label="100.000 Đ ~ 200.000 Đ"
            data-id="filter-price-3"
        >
        <label for="filter-price-3">
            <span>100.000 Đ ~ 200.000 Đ</span>
        </label>
    </li>
  ...
</ul>
```

###### custom option

```sh
    <ul filter-sections>
        {% assign list_size = settings.shop_by_size_list | split: ',' %}
        {% for size in list_size %}
        <li>
            <input
                id="filer-size-{{ forloop.index }}"
                type="checkbox"
                name="filer-size-{{ forloop.index }}"
                value="(variant:product**{{ size }})"
                filter-option
                data-label="{{ size }}"
                data-id="filer-size-{{ forloop.index }}"
            >
            <label for="filer-size-{{ forloop.index }}">{{ size }}</label>
        </li>
        {% endfor %}
    </ul>
```

##### block sortby option

```sh
<select filter-sortby>
    <option value="manual"> Nổi bật</option>
    <option value="(price:product=asc)">Giá: Tăng dần</option>
    <option value="(price:product=desc)">Giá: Giảm dần</option>
    <option value="(title:product=asc)">Tên: A-Z</option>
    <option value="(title:product=desc)">Tên: Z-A</option>
    <option value="(updated_at:product=asc)">Cũ nhất</option>
    <option value="(updated_at:product=desc)">Mới nhất</option>
    <option value="(sold_quantity:product=desc)">Bán chạy nhất</option>
</select>
```

##### block selected option

```sh
<div filter-selected></div>
```

###### html after render if you wanna custom style

```sh
<div filter-selected>
    <div class="filter-selected-item">
        ....
        <span class="filter-selected-remove" data-id="...">X</span>
    </div>
    <button class="filter-selected-clear"> hủy </button>
</div>
```

##### button load more

```sh
<button filter-btnload>
 xem thêm
</button>
```

##### block pagination

```sh

<div class="pagination">

{% if paginate.pages > 1 %}

    <div class="col-lg-2 col-md-2 col-sm-3 hidden-xs">
    {% if paginate.previous %}
        <a
            class="prev fa fa-angle-left"
            filter-pagination
            data-page="0"
            href="#"
        >
            <span>đầu</span>
        </a>
    {% endif %}
    </div>

    <div class="col-lg-8 col-md-8 col-sm-6 col-xs-12 text-center">
        {%for part in paginate.parts%}
            {%if part.is_link%}
                <a
                    class="page-node"
                    filter-pagination
                    data-page="{{part.title}}"
                    href="#"
                >
                    {{part.title}}
                </a>
            {%else%}
                <span class="page-node {%if part.title == paginate.current_page%}current{%endif%}">{{part.title}}</span>
            {%endif%}
        {%endfor%}
    </div>

    <div class="col-lg-2 col-md-2 col-sm-3 hidden-xs">
    {% if paginate.next %}
        <a
            class="pull-right next fa fa-angle-right"
            filter-pagination
            data-page="{{paginate.pages}}" href="#"
        >
        <span>cuối</span>
        </a>
    {% endif %}
    </div>

{% endif %}

</div>
```
