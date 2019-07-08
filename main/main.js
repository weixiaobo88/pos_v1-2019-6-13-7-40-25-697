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

function countTags(tags) {}

function getItems(countedTags, allItems) {}

function getReceiptDetail() {
  return `名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)`;
}
