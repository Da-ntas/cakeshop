import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { defaultQuery } from "../../functions/default_query";
import z from "zod";
import { vw_order } from "../../db/views/vw_orders";

export const orderRoutes: FastifyPluginAsyncZod = async (app) => {
    app.get("/orders", {
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
}