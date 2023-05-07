import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from 'path'
import { prisma } from '@/services/prisma'

const server = fastify();

server.register(fastifyStatic, {
  root: path.join(__dirname, '../static')
})


server.get('/', (request, reply) => {
  reply.sendFile('index.html')
})

server.get('/teste', async () => {
  await prisma.client.create({
    data: {
      name: 'teste'
    }
  })
})


server.listen({ port: 3334, host: '0.0.0.0' }, (err) => {
  if (err != null) {
    console.log('Error on started server! >> ' + err)
    return
  }
  console.log('Server started successfully!')
})
