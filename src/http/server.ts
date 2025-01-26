import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import { userRoutes } from './routes/user';
import { loginRoutes } from './routes/login';
import { middlewareOnRequest } from './middleware';
import { statusRoutes } from './routes/status';
import { productRoutes } from './routes/product';
import { flavourRoutes } from './routes/flavour';
import { orderRoutes } from './routes/order';

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.addHook('onRequest', middlewareOnRequest)

app.register(userRoutes);
app.register(loginRoutes);
app.register(statusRoutes);
app.register(productRoutes);
app.register(flavourRoutes);
app.register(orderRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP SERVER RUNNING!')
  })
