import { checkoutModel } from "../models/checkout_model";
import { UserOrderModel } from "../models/orderModel";
import axios from "axios";

export class PaymentService {
  public static async verify(reference: string) {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            authorization: `Bearer ${process.env.PAY_STACK_API_KEY}`,
            "content-type": "application/json",
            "cache-control": "no-cache",
          },
        }
      );

      if (response.status !== 200) throw new Error(response.data.message);

      if (response.data.status !== true)
        throw new Error("Verification unsuccessful");

      const orderId = response.data.data.metadata.custom_fields[0].orderId;

      const order = await UserOrderModel.findById(orderId);

      if (!order)
        throw new Error(`order for payment reference "${reference}" not found`);

      /**
       * Get the total cost of the products in the order
       * if total cost of products in order is not equal to amount paid throw error
       *
       */

      /**
       * Since we have conformed that
       * 1) the reference exist (from paystack),
       * 2) the order id attached to the payment through the metadata exist
       * 3) the total amount paid === total cost of the products (total cost of order or cost of each product should be stored in the database)
       *
       * You should
       * 1) Update the paymentType, PaymentStatus, paymentReference, paymentProcessor of the order
       */

      return response.data;
    } catch (error) {
      console.error;
    }
  }

  async paymentReceipt(reference: string) {
    try {
      const transaction = await checkoutModel.findOne({ reference: reference });
      return transaction;
    } catch (error: any) {
      error.source = "Payment Receipt";
      console.error;
    }
  }
}
