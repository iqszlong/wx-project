import utils from ".";

const countPrice = (array = []) => {
  let price = 0;
  // console.log('array',array);
  array.forEach((el) => {
    const item_price = utils.calculate.highPrecisionMul(
      el.goodsPrice,
      el.quantity
    );
    price = item_price + price;
  });

  return price;
};

export { countPrice };
