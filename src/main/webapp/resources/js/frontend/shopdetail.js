$(function () {
    var loading = false;
    var maxItems = 20;
    var pageSize = 3;  // number of products in each page
    var listUrl = '/online_store/frontend/listproductsbyshop';
    var pageNum = 1;
    var shopId = getQueryString('shopId');  // get shopId from url
    var productCategoryId = '';
    var productName = '';
    var searchDivUrl = '/online_store/frontend/listshopdetailpageinfo?shopId=' + shopId;
    getSearchDivData();
    addItems(pageSize, pageNum);
    $('#exchangelist').attr('href', '/online_store/frontend/awardlist?shopId=' + shopId);

    // get shop detail and productCategoryList
    function getSearchDivData() {
        var url = searchDivUrl;
        $
            .getJSON(
                url,
                function (data) {
                    if (data.success) {
                        var shop = data.shop;
                        $('#shop-cover-pic').attr('src',
                            getContextPath() + shop.shopImg);
                        $('#shop-update-time').html(
                            new Date(shop.lastEditTime)
                                .Format("yyyy-MM-dd"));
                        $('#shop-name').html(shop.shopName);
                        $('#shop-desc').html(shop.shopDesc);
                        $('#shop-addr').html(shop.shopAddr);
                        $('#shop-phone').html(shop.phone);
                        var productCategoryList = data.productCategoryList;
                        var html = '';
                        productCategoryList
                            .map(function (item, index) {
                                html += '<a href="#" class="button" data-product-search-id='
                                    + item.productCategoryId
                                    + '>'
                                    + item.productCategoryName
                                    + '</a>';
                            });
                        $('#shopdetail-button-div').html(html);
                    }
                });
    }

    function addItems(pageSize, pageIndex) {
        var url = listUrl + '?' + 'pageIndex=' + pageIndex + '&pageSize='
            + pageSize + '&productCategoryId=' + productCategoryId
            + '&productName=' + productName + '&shopId=' + shopId;
        loading = true;
        $.getJSON(url, function (data) {
            if (data.success) {
                maxItems = data.count;
                var html = '';
                data.productList.map(function (item, index) {
                    html += '' + '<div class="card" data-product-id='
                        + item.productId + '>'
                        + '<div class="card-header">' + item.productName
                        + '</div>' + '<div class="card-content">'
                        + '<div class="list-block media-list">' + '<ul>'
                        + '<li class="item-content">'
                        + '<div class="item-media">' + '<img src="'
                        + getContextPath() + item.imgAddr + '" width="44">'
                        + '</div>' + '<div class="item-inner">'
                        + '<div class="item-subtitle">' + item.productDesc
                        + '</div>' + '</div>' + '</li>' + '</ul>'
                        + '</div>' + '</div>' + '<div class="card-footer">'
                        + '<p class="color-gray">'
                        + new Date(item.lastEditTime).Format("yyyy-MM-dd")
                        + 'Update</p>' + '<span>View detail</span>' + '</div>'
                        + '</div>';
                });
                $('.list-div').append(html);
                // total number of cards
                var total = $('.list-div.card').length;
                if (total >= maxItems) {
                    $('.infinite-scroll-preloader').hide();
                } else {
                    $('.infinite-scroll-preloader').show();
                }
                pageNum += 1;
                loading = false;
                $.refreshScroller();
            }
        });
    }

    $(document).on('infinite', '.infinite-scroll-bottom', function () {
        if (loading)
            return;
        addItems(pageSize, pageNum);
    });

	// Empty the list and search using new productCategory
	$('#shopdetail-button-div').on('click', '.button', function (e) {
            productCategoryId = e.target.dataset.productSearchId;
            if (productCategoryId) {
                if ($(e.target).hasClass('button-fill')) {
                    $(e.target).removeClass('button-fill');
                    productCategoryId = '';
                } else {
                    $(e.target).addClass('button-fill').siblings()
                        .removeClass('button-fill');
                }
                $('.list-div').empty();
                pageNum = 1;
                addItems(pageSize, pageNum);
            }
        });

    $('.list-div').on(
        'click',
        '.card',
        function (e) {
            var productId = e.currentTarget.dataset.productId;
            window.location.href = '/online_store/frontend/productdetail?productId='
                + productId;
        });

    // Empty the shop list and search using new name
    $('#search').on('change', function (e) {
        productName = e.target.value;
        $('.list-div').empty();
        pageNum = 1;
        addItems(pageSize, pageNum);
    });

    // open right panel (Me)
    $('#me').click(function () {
        $.openPanel('#panel-right-demo');
    });
    $.init();
});
