package com.store.service.impl;

import com.store.dao.ShopDao;
import com.store.dto.ShopExecution;
import com.store.entity.Shop;
import com.store.enums.ShopStateEnum;
import com.store.exceptions.ShopOperationException;
import com.store.service.ShopService;
import com.store.util.ImageUtil;
import com.store.util.PathUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.Date;

@Service
public class ShopServiceImpl implements ShopService {
    @Autowired
    private ShopDao shopDao;

    @Override
    @Transactional
    public ShopExecution addShop(Shop shop, File shopImg) {
        if (shop == null) {
            return new ShopExecution(ShopStateEnum.NULL_SHOP);
        }
        try {
            shop.setEnableStatus(0);
            shop.setCreateTime(new Date());
            shop.setLastEditTime(new Date());
            int effectedNum = shopDao.insertShop(shop);
            if (effectedNum <= 0) {
                // Use ShopOperationException to rollback when exceptions occur
                throw new ShopOperationException("AddShop failure");
            } else {
                if (shopImg != null) {
                    try{
                        addShopImg(shop, shopImg);
                    } catch (Exception e) {
                        throw new ShopOperationException("addShopImg error: " + e.getMessage());
                    }
                    effectedNum = shopDao.updateShop(shop);
                    if (effectedNum <= 0) {
                        throw new ShopOperationException("Update shopImg failure");
                    }
                }
            }
        } catch (Exception e) {
            throw new ShopOperationException("addShop error: " + e.getMessage());
        }
        return new ShopExecution(ShopStateEnum.CHECK, shop);
    }

    private void addShopImg(Shop shop, File shopImg) {
        String dest = PathUtil.getShopImgPath(shop.getShopId());
        String shopImgPath = ImageUtil.generateThumbNail(shopImg, dest);
        shop.setShopImg(shopImgPath);
    }
}