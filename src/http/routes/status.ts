import z from "zod";
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { defaultQuery } from "../../functions/default_query";
import { status } from "../../db/schema";

export const statusRoutes:FastifyPluginAsyncZod = async (app) => {
    app.get("/status", {
        schema: {
            querystring: z.object({
                codStatus: z.string().min(2).max(8).optional(),
                nomStatus: z.string().min(2).max(25).optional(),
                nomStatusMaster: z.string().min(2).max(25).optional()
            }).optional()
        }
    }, async (request) => {
        const params = request.query;
        
        const result = await defaultQuery.defaultGetAll({
            fieldsToSelect: undefined,
            schema: status,
            params: params
        });

        return result;
    });

    app.get("/status/:codStatus", {
        schema: {
            params: z.object({
                codStatus: z.string().min(2).max(8)
            }).required(),
        }
    }, async (request) => {
        const params = request.params;

        const { data } = await defaultQuery.defaultGetWithFilters({
            fieldsToSelect: undefined,
            schema: status,
            params: params
        });
        return data;
    });

    app.post("/status", {
        schema: {
            body: z.object({
                codStatus: z.string().min(2).max(8),
                nomStatus: z.string().min(2).max(25),
                nomStatusMaster: z.string().min(2).max(25)
            })
        }
    }, async (request) => {
        const body = request.body;
        
        const { data } = await defaultQuery.defaultCreate({
            schema: status,
            data: {
                ...body
            }
        });

        return data;
    });

    app.put("/status/:codStatus", {
        schema: {
            params: z.object({
                codStatus: z.string().min(1).max(8)
            }).required(),
            body: z.object({
                codStatus: z.string().min(2).max(8).optional(),
                nomStatus: z.string().min(2).max(25).optional(),
                nomStatusMaster: z.string().min(2).max(25).optional()
            })
        }
    }, async (request) => {
        const params= request.params;
        const body = request.body;

        if(Object.keys(body).length === 0) {
            return {message: "Missing fields to update"};
        }

        const { data } = await defaultQuery.defaultUpdate({
            schema: status,
            data: body,
            params: params
        });

        return data;
    });

    app.delete("/status/:codStatus", {
        schema: {
            params: z.object({
                codStatus: z.string().min(1).max(8)
            })
        }
    }, async (request) => {
        const params= request.params;

        const { data } = await defaultQuery.defaultDelete({
            schema: status,
            params: params
        });

        return data;
    });
}