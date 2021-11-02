const database = require('./database')
const { ApolloServer, gql } = require('apollo-server')
const { equipments, supplies } = require('./database')
/**
 * typeDef
 * GraphQL 명세에서 사용될 데이터, 요청 타입 지정
 * gql (template literal tag) 로 생성됨
 * 
 */ 
const typeDefs = gql`
  type Query {
    teams: [Team]
    team(id :Int): Team
    equipments: [Equipment]
    supplies : [Supply]
  }
  type Team {
    id: Int
    manager: String
    office: String
    extension_number: String
    mascot: String
    cleaning_duty: String
    project: String
    supplies: [Supply]
  }
  type Equipment {
    id: String,
    used_by: String,
    count: Int,
    new_or_used: String
  }
  type Supply {
    id: String,
    team: Int
  }
`
/**
 * resolver
 * 서비스의 액션들을 함수로 지정
 * 요청에 따라 데이터를 반환, 입력, 수정, 삭제
 */
const resolvers = {
  Query: {
    teams: () => database.teams
    .map((team) => {
      team.supplies = database.supplies
      .filter((supply) => {
          return supply.team === team.id
      })
      return team
    }),
    team: (parent, args, context, info) => database.teams
        .filter((team) => {
            return team.id === args.id
        })[0],
    equipments: () => database.equipments,
    supplies: () => database.supplies
  }
}
// ApolloServer : typeDef와 resolver를 인자로 받아 서버 생성
const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(({ url }) => {
console.log(`🚀  Server ready at ${url}`)
})