import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { defaultQuery } from "../../functions/default_query";
import z from "zod";
import { vw_order } from "../../db/views/vw_orders";
import { order, orderItem, orderPayment } from "../../db/schema";
import { db } from "../../db";

export const orderRoutes: FastifyPluginAsyncZod = async (app) => {
    app.get("/order", {
        schema: {
            querystring: z.object({
                codUser: z.coerce.number()
            })
        }
    }, async ( request) => {
        const params = request.query;
        
        const result = await defaultQuery.defaultGetAll({
            fieldsToSelect: undefined,
            schema: vw_order,
            params: params
        });

        return result;
    })

    app.post("/order", {
        schema: {
            body: z.object({
                codUser: z.number(),
                codStatus: z.string().min(1),
                dtaToDeliver: z.coerce.date(),
                payment: z.object({
                    codPaymentType: z.string(),
                    qtdParcels: z.number().default(1),
                    vlrTotalOrder: z.string()
                        .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid monetary value")
                        .transform((value) => Number.parseFloat(value))
                }),
                items: z.array(
                    z.object({
                        codProduct: z.coerce.number().min(1),
                        codFlavour: z.coerce.number().min(1),
                        dscDescription: z.string()
                    })
                )
            })
        }
    }, async (request) => {
        const { items: orderItems, payment, ...orderData } = request.body;
    
        try {
            return await db.transaction(async (tx) => {
                // Cria o pedido dentro da transação
                const { data: orderCreated } = await defaultQuery.defaultCreate({
                    schema: order,
                    data: orderData,
                    tx // Passa a transação como parâmetro
                });
    
                if (!orderCreated.codOrder) throw new Error("Error creating the order");
    
                // Cria o pagamento vinculado ao pedido
                const { data: orderPaymentCreated } = await defaultQuery.defaultCreate({
                    schema: orderPayment,
                    data: {
                        ...payment,
                        codOrder: orderCreated.codOrder
                    },
                    tx // Passa a transação
                });
    
                // Insere os itens do pedido
                const fmtOrderItems = orderItems.map(e => ({ ...e, codOrder: orderCreated.codOrder }));
                const { data: orderItemsCreated } = await defaultQuery.defaultCreate({
                    schema: orderItem,
                    data: fmtOrderItems,
                    tx // Passa a transação
                });
    
                return {
                    data: {
                        ...orderCreated,
                        payment: orderPaymentCreated,
                        items: orderItemsCreated
                    }
                };
            });
    
        } catch (error) {
            console.error("Error:", error);
            return {
                error: "Error creating the order, alterations not made."
            };
        }
    });
}