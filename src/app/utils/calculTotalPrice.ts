// src/app/utils/price-utils.ts

import { CartProductSelectedInterface } from '../model/productSelected.interface';
import { ServiceOptionsInterface } from '../model/serviceOptions.interface';

// 假设这是一个函数，用于根据 ID 查找服务选项的详情。
// 注意：您需要根据实际情况实现获取服务选项详情的逻辑。
function getServiceOptionById(
  serviceOptions: ServiceOptionsInterface[],
  id: string
): ServiceOptionsInterface | undefined {
  return serviceOptions.find((option) => option['@id'] === id);
}

// 计算总价的函数
export function calculateTotalPrice(
  items: CartProductSelectedInterface[],
  serviceOptions: ServiceOptionsInterface[]
): number {
  let totalPrice = 0;
  items.forEach((item) => {
    let itemTotal = item.price * item.quantity; // 基础价格乘以数量
    item.serviceOptions.forEach((serviceOptionId) => {
      const serviceOption = getServiceOptionById(
        serviceOptions,
        serviceOptionId
      );
      if (serviceOption) {
        itemTotal += itemTotal * serviceOption.coefficentPrice; // 增加服务选项的额外费用
      }
    });
    totalPrice += itemTotal;
  });
  return totalPrice;
}
