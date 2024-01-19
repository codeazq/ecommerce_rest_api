import mongoose, { Schema } from "mongoose";
import {
  OrderInterface,
  OrderProductInterface,
} from "../interfaces/order_interface";

const OrderProductSchema = new Schema<OrderProductInterface>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "ProductModel",
  },
  // if count is quantity, you should rename this to quantity
  count: Number,
  color: String,
});

const orderSchema = new Schema<OrderInterface>(
  {
    // products: { type: [OrderProductSchema], required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "ProductModel",
        },
        // if count is quantity, you should rename this to quantity
        count: Number,
        color: String,
        // it would be a goos idea to sore the current price, of the products
        // and / or the total cost of the order
      },
    ],
    paymentIntent: {},
    paymentType: {
      type: String,
      default: "Web",
      enum: ["Web", "Cash on Delivery"],
    },
    PaymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Failed", "Successful"],
    },
    paymentReference: {
      type: String,
    },
    paymentProcessor: {
      type: String,
      enum: ["Paystack", "Cash"],
    },
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Cash on Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    orderby: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
    },
  },
  {
    timestamps: true,
  }
);

export const UserOrderModel = mongoose.model<OrderInterface>(
  "OrderModel",
  orderSchema
);
