import { MenuSettingsInfo } from 'model/api/menu.settings';
import { MenuSettings } from 'model/dto/menu.settings';
import _ from 'lodash';
import { MenuCategoryInfo } from 'model/api/menu.category';
import { MenuCategory } from 'model/dto/menu.category';
import { MenuItemInfo } from 'model/api/menu.item';
import { MenuItem } from 'model/dto/menu.item';
import { IWorkingTimeInfo } from 'model/api/company';

export class MenuSettingsBuilder {
    static build(menuSettingInfo: MenuSettingsInfo): MenuSettings {
        let menuSetting: MenuSettings = new MenuSettings();

        if (!menuSettingInfo) {
            return menuSetting;
        }

        if (!_.isUndefined(menuSettingInfo.id)) {
            menuSetting.id = menuSettingInfo.id;
        }

        if (!_.isUndefined(menuSettingInfo.name)) {
            menuSetting.name = menuSettingInfo.name;
        }

        if (!_.isUndefined(menuSettingInfo.type)) {
            menuSetting.type = menuSettingInfo.type;
        }

        if (!_.isUndefined(menuSettingInfo.domain)) {
            menuSetting.domain = menuSettingInfo.domain;
        }

        if (!_.isUndefined(menuSettingInfo.providerId)) {
            menuSetting.providerId = menuSettingInfo.providerId;
        }

        if (!_.isUndefined(menuSettingInfo.enabled)) {
            menuSetting.enabled = menuSettingInfo.enabled;
        }

        if (!_.isUndefined(menuSettingInfo.showDisabledMenuItems)) {
            menuSetting.showDisabledMenuItems = menuSettingInfo.showDisabledMenuItems;
        }

        if (!_.isUndefined(menuSettingInfo.delivery)) {
            menuSetting.delivery = menuSettingInfo.delivery;
        }

        if (menuSettingInfo.minPrice) {
            menuSetting.minPrice = menuSettingInfo.minPrice;
        }

        if (!_.isUndefined(menuSettingInfo.phone)) {
            menuSetting.phone = menuSettingInfo.phone;
        }

        if (!_.isUndefined(menuSettingInfo.telegram)) {
            menuSetting.telegram = menuSettingInfo.telegram;
        }

        if (menuSettingInfo.city) {
            menuSetting.city = menuSettingInfo.city;
        }

        if (!_.isUndefined(menuSettingInfo.email)) {
            menuSetting.email = menuSettingInfo.email;
        }

        this.buildDeliveryTime(menuSetting, menuSettingInfo.deliveryTime);
        this.buildItems(menuSetting, menuSettingInfo.items);
        this.buildCategories(menuSetting, menuSettingInfo.categories);

        return menuSetting;
    }

    static buildItems(menuSetting: MenuSettings, items: MenuItemInfo[]) {
        menuSetting.items = [];

        _.each(items, (itemInfo: MenuItemInfo) => {
            menuSetting.items.push(this.buildItem(itemInfo));
        });
    }

    static buildItem(itemInfo: MenuItemInfo): MenuItem {
        const item = new MenuItem(itemInfo.configId);

        item.id = itemInfo.id;
        item.categoryId = itemInfo.categoryId;
        item.enabled = itemInfo.enabled;
        item.name = itemInfo.name;
        item.description = itemInfo.description;
        item.sort = itemInfo.sort;
        item.image = itemInfo.image;
        item.imageId = itemInfo.imageId;
        item.priceAfterDiscount = itemInfo.priceAfterDiscount;
        item.priceBeforeDiscount = itemInfo.priceBeforeDiscount;
        item.weight = itemInfo.weight;
        item.weightUnit = itemInfo.weightUnit;
        item.calories = itemInfo.calories;

        return item;
    }

    static getDefaultCategory(configId: number): MenuCategory {
        const defaultCategory: MenuCategory = new MenuCategory(configId);
        defaultCategory.id = 0;
        defaultCategory.name = 'Остальное';
        defaultCategory.description = 'Если других категорий нет, гости увидят все позиции без отображения категорий';
        defaultCategory.sort = 100;
        defaultCategory.isDefault = true;

        return defaultCategory;
    }

    static buildCategories(menuSetting: MenuSettings, categories: MenuCategoryInfo[]) {
        menuSetting.categories = [];

        _.each(categories, (categoryInfo: MenuCategoryInfo) => {
            if (!categoryInfo.enabled) {
                return;
            }

            menuSetting.categories.push(this.buildCategory(categoryInfo));
        });

        menuSetting.categories.push(this.getDefaultCategory(menuSetting.id));
    }

    static buildCategory(categoryInfo: MenuCategoryInfo): MenuCategory {
        const category = new MenuCategory(categoryInfo.configId);

        category.enabled = categoryInfo.enabled;
        category.name = categoryInfo.name;
        category.id = categoryInfo.id;
        category.sort = categoryInfo.sort;

        return category;
    }

    static setCountCategories(settings: MenuSettings) {
        _.each(settings.categories, (category: MenuCategory) => {
            category.count = _.filter(settings.items, (item: MenuItem) => item.categoryId === category.id).length;
        });
    }

    static buildDeliveryTime(settings: MenuSettings, deliveryTimeInfo: IWorkingTimeInfo) {
        if (!deliveryTimeInfo) {
            return;
        }

        for (let dayCode in deliveryTimeInfo) {
            let workingTime = deliveryTimeInfo[dayCode];

            if (workingTime) {
                let workingTimeParts = workingTime.split('-');

                if (workingTimeParts.length === 2) {
                    settings.deliveryTime[dayCode].open = workingTimeParts[0].trim();
                    settings.deliveryTime[dayCode].close = workingTimeParts[1].trim();
                    settings.deliveryTime[dayCode].isWorking = true;
                } else {
                    settings.deliveryTime[dayCode].isWorking = false;
                }
            } else {
                settings.deliveryTime[dayCode].open = null;
                settings.deliveryTime[dayCode].close = null;
                settings.deliveryTime[dayCode].isWorking = false;
            }
        }
    }
}
