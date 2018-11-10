# hrv-filter

Plugin filter list product for haravan

**include file hrv.fitler.min.js before close body tag**

```sh
{{ 'hrv.fitler.min.js' | asset_url | script_tag }}
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

### Colection container

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

**done**
