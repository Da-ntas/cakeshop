import type { FastifyRequest, FastifyReply } from 'fastify';
import { isTokenValid } from '../helper';

export async function middlewareOnRequest(request: FastifyRequest, reply: FastifyReply) {
    const authorization = request.headers.authorization;

    const flagBearer = authorization?.toLowerCase()?.startsWith('bearer');

    if(!authorization || !flagBearer || !isTokenValid(authorization.replace(/^(bearer)\s/gi, ""))) {
        return reply.status(400).send({message: "Acesso negado"});
    }
}