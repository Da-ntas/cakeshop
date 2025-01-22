import z from "zod";
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { defaultQuery } from "../../functions/default_query";
import { flavour } from "../../db/schema";

export const flavourRoutes:FastifyPluginAsyncZod = async (app) => {
    app.get("/flavour", {
        schema: {
            querystring: z.object({
                codFlavour: z.number().optional(),
                nomFlavour: z.string().min(2).max(50).optional()
            }).optional()
        }
    }, async (request) => {
        const params = request.query;
        
        const result = await defaultQuery.defaultGetAll({
            fieldsToSelect: undefined,
            schema: flavour,
            params: params
        });

        return result;
    });

    app.get("/flavour/:codFlavour", {
        schema: {
            params: z.object({
                codFlavour: z.number()
            }).required(),
        }
    }, async (request) => {
        const params = request.params;

        const { data } = await defaultQuery.defaultGetWithFilters({
            fieldsToSelect: undefined,
            schema: flavour,
            params: params
        });
        return data;
    });

    app.post("/flavour", {
        schema: {
            body: z.object({
                codFlavour: z.number(),
                nomFlavour: z.string().min(2).max(50),
            })
        }
    }, async (request) => {
        const body = request.body;
        
        const { data } = await defaultQuery.defaultCreate({
            schema: flavour,
            data: {
                ...body
            }
        });

        return data;
    });

    app.put("/flavour/:codFlavour", {
        schema: {
            params: z.object({
                codFlavour: z.number()
            }).required(),
            body: z.object({
                codFlavour: z.number().optional(),
                nomFlavour: z.string().min(2).max(50).optional(),
            })
        }
    }, async (request) => {
        const params= request.params;
        const body = request.body;

        if(Object.keys(body).length === 0) {
            return {message: "Missing fields to update"};
        }

        const { data } = await defaultQuery.defaultUpdate({
            schema: flavour,
            data: body,
            params: params
        });

        return data;
    });

    app.delete("/flavour/:codFlavour", {
        schema: {
            params: z.object({
                codFlavour: z.number()
            })
        }
    }, async (request) => {
        const params= request.params;

        const { data } = await defaultQuery.defaultDelete({
            schema: flavour,
            params: params
        });

        return data;
    });
}