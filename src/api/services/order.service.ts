import { validateMongoDbID } from "../helpers/validateDbId";
import { UserOrderModel } from "../models/orderModel";
import {
  CreateOrderParams,
  OrderInterface,
} from "../interfaces/order_interface";

export class OrderService {
  public static async create(data: CreateOrderParams): Promise<any> {
    try {
      const order = await UserOrderModel.create(data);

      const populatedOrder = await UserOrderModel.findById(order._id).populate(
        "products.product"
      );

      if (!populatedOrder) throw new Error("error processing order");

      const totalCost: number = populatedOrder.products.reduce(
        (total, current) => total + current.product.price * current.count,
        0
      );

      // return { ...populatedOrder, totalCost: totalCost };
      return { order: populatedOrder, totalCost };
    } catch (error) {
      throw new Error("Error creating order");
    }
  }

  public static async findAllByUserId(
    userId: string
  ): Promise<OrderInterface[]> {
    try {
      const orders = await UserOrderModel.find({ orderby: userId }).exec();
      return orders;
    } catch (error) {
      throw new Error("Error fetching orders");
    }
  }
}
