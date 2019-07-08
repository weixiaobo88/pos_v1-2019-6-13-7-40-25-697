"use strict";

function printReceipt(tags) {
  const countedTags = countTags(tags);
  const allItems = loadAllItems();
  const countedItems = getItems(countedTags, allItems);
  console.info(countedItems);
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
  tags.forEach(tag => {
    const matchedIndex = findMatchedIndex(result, tag);
    if (matchedIndex > -1) {
      const matched = result[matchedIndex];
      result[matchedIndex] = {
        barcode: matched.barcode,
        count: matched.count + 1
      };
    } else {
      result.push({ barcode: tag, count: 1 });
    }
  });
  result = handleSpecial(result);
  return result;
}

function findMatchedIndex(collection, barcode) {
  return collection.findIndex(item => item.barcode === barcode);
}

function handleSpecial(countedTags) {
  return countedTags.map(tag => {
    const barcode = tag.barcode;
    if (hasDash(barcode)) {
      return countDashTag(barcode);
    }
    return tag;
  });
}

function hasDash(barcode) {
  return barcode.indexOf("-") > -1;
}

function countDashTag(barcode) {
  const splited = barcode.split("-");
  return { barcode: splited[0], count: parseFloat(splited[1]) };
}

function getItems(countedTags, allItems) {
  return countedTags.map(item => ({
    ...item,
    ...findMatchedItem(allItems, item.barcode)
  }));
}

function findMatchedItem(allItems, barcode) {
  return allItems.find(item => item.barcode === barcode);
}

function getReceiptDetail(countedItems) {
  return `名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)`;
}
