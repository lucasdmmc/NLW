import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Fulano',
      email: 'lucas@gmail.com',
      avatarUrl: 'https://github.com/lucasdmmc.png',
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: "Exemplo do bolão",
      code: 'BOL123',
      ownerId: user.id,
    
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: "2022-11-02T18:00:00.685Z",
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "BR",
    }
  })

  await prisma.game.create({
    data: {
      date: "2022-11-03T18:00:00.685Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              }
            }
          }
        }
      }
    },
  })
}

main()

// async function main() {
//   const user = await prisma.user.create({
//     data: {
//       name: "Lucas",
//       email: "lucas@hotmail.com",
//       avatarUrl: "https://github.com/lucasdmmc.png",
//     }
//   })


//   await prisma.game.create({
//     data: {
//       date: "2022-11-03T2:27:20.623Z",
//       firstTeamCountryCode: "DE",
//       secondTeamCountryCode: "BR",
//     }
//   })

//   await prisma.game.create({
//     data: {
//       date: "2022-11-04T00:00:20.623Z",
//       firstTeamCountryCode: "BR",
//       secondTeamCountryCode: "AR",

//       guesses: {
//         create: {
//           firstTeamPoints: 2,
//           secondTeamPoints: 1,

//           participant: {
//             connect: {
//               userId_poolId: {
//                 userId: user.id,
//               }
//             }
//           }
//         }
//       }
//     },
//   })
// }

main()