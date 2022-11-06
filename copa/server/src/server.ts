import Fastify from "fastify";
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"

import { poolRoutes } from "./Routes/pool";
import { authRoutes } from "./Routes/auth";
import { gameRoutes } from "./Routes/game";
import { guessRoutes } from "./Routes/guess";
import { userRoutes } from "./Routes/user";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true
  })

  await fastify.register(jwt, {
    secret: "santodoido",
  })

  fastify.register(poolRoutes)
  fastify.register(authRoutes)
  fastify.register(gameRoutes)
  fastify.register(guessRoutes)
  fastify.register(userRoutes)

  await fastify.listen({ port: 3333, /*host: "0.0.0.0"*/ })
}

bootstrap()