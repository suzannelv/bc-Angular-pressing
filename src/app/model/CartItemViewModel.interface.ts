import { CartProductSelectedInterface } from './productSelected.interface';

export interface CartItemViewModel extends CartProductSelectedInterface {
  materialName: string; // 添加了材料名称属性
  serviceOptionsNames: string[]; // 添加了服务选项名称数组属性
}
