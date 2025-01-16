import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import { deleteUser, getUserById, getUsers, postUser, updateUser } from './routes/user';
import { login, refreshToken } from './routes/login';

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.register(getUsers)
app.register(getUserById)
app.register(postUser)
app.register(updateUser)
app.register(deleteUser)
app.register(login)
app.register(refreshToken)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP SERVER RUNNING!')
  })
