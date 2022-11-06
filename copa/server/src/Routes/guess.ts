import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"
import { authRoutes } from "./auth"

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.pool.count()
  
    return { count }
  })

  fastify.post("/pools/:poolId/games/:gameId/guesses",
  {onRequest: [authenticate],}, async (request, reply) => {
    const createGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string(),
    })

    const createGuessBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number(),
    })

    const { poolId, gameId } = createGuessParams.parse(request.params)
    const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)

    const particapant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          poolId,
          userId: request.user.sub
        }
      }
    })

    if (!particapant) {
      return reply.status(400).send({
        message: "You're not allowed to create a guess inside this pool."
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          participantId: particapant.id,
          gameId,
        }
      }
    })

    if (guess) {
      return reply.status(400).send({
        message: "You already have a guess in this pool."
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      }
    })

    if (!game) {
      return reply.status(400).send({
        message: "This game doesn't exist."
      })
    }

    // if (game.date < new Date()) {
    //   return reply.status(400).send({
    //     message: "You cannot send guesses after the game date.",
    //   })
    // }

    await prisma.guess.create({
      data: {
        gameId,
        participantId: particapant.id,
        firstTeamPoints,
        secondTeamPoints,
      }
    })



    return reply.status(201).send()
  })
}