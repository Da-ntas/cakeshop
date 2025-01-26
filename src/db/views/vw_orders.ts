import { pgView } from "drizzle-orm/pg-core";
import { order, orderItem, orderPayment, paymentType, status, user } from "../schema";
import { count, eq } from "drizzle-orm";

export const vw_order = pgView("vw_order").as((qb) => {
    return qb
        .select({
            codOrder: order.codOrder,
            codUser: order.codUser,
            nomUser: user.nomUser,
            codStatus: order.codStatus,
            nomStatus: status.nomStatus,
            codOrderPayment: order.codOrderPayment,
            qtdParcels: orderPayment.qtdParcels,
            vlrTotalOrder: orderPayment.vlrTotalOrder,
            nomPaymentType: paymentType.nomPaymentType,
            flagParcel: paymentType.flagParcel,
            vlrQtdMaxParcel: paymentType.vlrQtdMaxParcel,
            fees: paymentType.fees,
            dtaToDeliver: order.dtaToDeliver,
            qtdItemsOrder: count(orderItem).as("qtdItemsOrder")
        })
        .from(order)
        .leftJoin(user, eq(user.codUser, order.codUser))
        .leftJoin(status, eq(status.codStatus, order.codStatus))
        .leftJoin(orderItem, eq(order.codOrder, orderItem.codOrder))
        .leftJoin(orderPayment, eq(order.codOrderPayment, orderPayment.codOrderPayment))
        .leftJoin(paymentType, eq(paymentType.codPaymentType, orderPayment.codPaymentType))
        .groupBy(
            order.codOrder,
            order.codUser,
            user.nomUser,
            order.codStatus,
            status.nomStatus,
            order.codOrderPayment,
            orderPayment.qtdParcels,
            orderPayment.vlrTotalOrder,
            paymentType.nomPaymentType,
            paymentType.flagParcel,
            paymentType.vlrQtdMaxParcel,
            paymentType.fees,
            order.dtaToDeliver
        )
})