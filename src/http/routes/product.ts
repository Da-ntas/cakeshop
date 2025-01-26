import z from "zod";
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { defaultQuery } from "../../functions/default_query";
import { product } from "../../db/schema";

export const productRoutes:FastifyPluginAsyncZod = async (app) => {
    app.get("/product", {
        schema: {
            querystring: z.object({
                codProduct: z.coerce.number().optional(),
                nomProduct: z.string().min(2).max(50).optional(),
                dscDescription: z.string().optional(),
            }).optional()
        }
    }, async (request) => {
        const params = request.query;
        
        const result = await defaultQuery.defaultGetAll({
            fieldsToSelect: undefined,
            schema: product,
            params: params
        });

        return result;
    });

    app.get("/product/:codProduct", {
        schema: {
            params: z.object({
                codProduct: z.coerce.number(),
            }).required(),
        }
    }, async (request) => {
        const params = request.params;

        const { data } = await defaultQuery.defaultGetWithFilters({
            fieldsToSelect: undefined,
            schema: product,
            params: params
        });
        return data;
    });

    app.post("/product", {
        schema: {
            body: z.object({
                codProduct: z.coerce.number(),
                nomProduct: z.string().min(2).max(50),
                dscDescription: z.string().optional(),
            })
        }
    }, async (request) => {
        const body = request.body;
        
        const { data } = await defaultQuery.defaultCreate({
            schema: product,
            data: {
                ...body
            }
        });

        return data;
    });

    app.put("/product/:codProduct", {
        schema: {
            params: z.object({
                codProduct: z.coerce.number(),
            }).required(),
            body: z.object({
                codProduct: z.number().optional(),
                nomProduct: z.string().min(2).max(50).optional(),
                dscDescription: z.string().optional(),
            })
        }
    }, async (request) => {
        const params= request.params;
        const body = request.body;

        if(Object.keys(body).length === 0) {
            return {message: "Missing fields to update"};
        }

        const { data } = await defaultQuery.defaultUpdate({
            schema: product,
            data: body,
            params: params
        });

        return data;
    });

    app.delete("/product/:codProduct", {
        schema: {
            params: z.object({
                codProduct: z.number()
            })
        }
    }, async (request) => {
        const params= request.params;

        const { data } = await defaultQuery.defaultDelete({
            schema: product,
            params: params
        });

        return data;
    });
}