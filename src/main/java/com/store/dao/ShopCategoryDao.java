package com.store.dao;

import com.store.entity.ShopCategory;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ShopCategoryDao {

    List<ShopCategory> queryShopCategory(@Param("shopCategoryCondition") ShopCategory shopCategoryCondition);

    ShopCategory queryShopCategoryById(long shopCategoryId);

    List<ShopCategory> queryShopCategoryByIds(List<Long> shopCategoryIdList);

    int insertShopCategory(ShopCategory shopCategory);

    int updateShopCategory(ShopCategory shopCategory);

    int deleteShopCategory(long shopCategoryId);

    int batchDeleteShopCategory(List<Long> shopCategoryIdList);

}
