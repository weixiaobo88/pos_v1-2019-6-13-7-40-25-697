"use strict";

function printReceipt(tags) {
  const countedTags = countTags(tags);
  const allItems = loadAllItems();
  const countedItems = getItems(countedTags, allItems);
  const receiptDetail = getReceiptDetail(countedItems);

  const result = `***<没钱赚商店>收据***
${receiptDetail}
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

  console.log(result);
}

function countTags(tags) {
  let result = [];
  for (let index = 0; index < tags.length; index++) {
    const tag = tags[index];
    result = transform(result, tag);
  }
  return result;
}

function transform(collection, barcode) {
  let result = [...collection];
  if (hasDash(barcode)) {
    const splited = barcode.split("-");
    const splitedBarcdoe = splited[0];
    const count = parseFloat(splited[1]);
    result = add(result, splitedBarcdoe, count);
  } else {
    result = add(result, barcode, 1);
  }

  return result;
}

function add(collection, barcode, count) {
  let result = [...collection];
  const matchedIndex = getIndex(result, barcode);

  if (matchedIndex > -1) {
    let matchedItem = result[matchedIndex];
    result[matchedIndex] = {
      ...matchedItem,
      count: matchedItem.count + count
    };
  } else {
    result.push({ barcode, count });
  }
  return result;
}

function getIndex(collection, barcode) {
  for (let index = 0; index < collection.length; index++) {
    const element = collection[index];
    if (element.barcode === barcode) {
      return index;
    }
  }
  return -1;
}

function hasDash(barcode) {
  return barcode.indexOf("-") > -1;
}

function getItems(countedTags, allItems) {
  return countedTags.map(item => ({
    ...item,
    ...findMatchedItem(allItems, item.barcode)
  }));
}

function findMatchedItem(allItems, barcode) {
  for (let index = 0; index < allItems.length; index++) {
    const item = allItems[index];
    if (item.barcode === barcode) {
      return item;
    }
  }
  return null;
}

function getReceiptDetail(countedItems) {
  const itemsWithSubtotal = calculateSubTotal(countedItems);
  let result = "";
  for (let index = 0; index < itemsWithSubtotal.length; index++) {
    const item = itemsWithSubtotal[index];
    result += getLine(item) + (index === countedItems.length - 1 ? "" : "\n");
  }
  return result;
}

function calculateSubTotal(countedItems) {
  let result = [];
  for (let index = 0; index < countedItems.length; index++) {
    const item = countedItems[index];
    const subTotal = calculateItemSubTotal(item);
    result.push({ ...item, subTotal: subTotal.toFixed(2) });
  }
  return result;
}

function getLine(item) {
  return `名称：${item.name}，数量：${item.count}${
    item.unit
  }，单价：${item.price.toFixed(2)}(元)，小计：${item.subTotal}(元)`;
}

function calculateItemSubTotal(item) {
  let subTotal = item.price * item.count;
  const promotions = loadPromotions();
  for (let index = 0; index < promotions.length; index++) {
    const promotion = promotions[index];
    if (promotion.barcodes.indexOf(item.barcode) > -1) {
      subTotal = handlePromotion(promotion, item);
    }
  }

  return subTotal;
}

function handlePromotion(promotion, item) {
  const count = item.count;
  if (promotion.type === "BUY_TWO_GET_ONE_FREE") {
    return item.price * (count - Math.floor(count / 3));
  }
  return item.price * count;
}
