const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema} = require('graphql');
const fetch = require('node-fetch');

//Launch type
const LaunchType = new GraphQLObjectType({
  name: 'Launch',
  fields: () => ({
    flight_number: {type: GraphQLInt},
    mission_name: {type: GraphQLString},
    launch_year: {type: GraphQLString},
    launch_date_local: {type: GraphQLString},
    success: {type: GraphQLBoolean},
    rocket: {type: RocketType},
  })
});

//rocket type
const RocketType = new GraphQLObjectType({
  name: 'Rocket',
  fields: () => ({
    rocketId: {type: GraphQLString},
    rocket_name: {type: GraphQLString},
    rocket_type: {type: GraphQLString}
  })
});

//root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        return fetch('https://api.spacexdata.com/v3/launches').then(res=>res.json());
      }
    },
    launch: {
      type: LaunchType,
      args: {
        flight_number: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`https://api.spacexdata.com/v3/launches/${args.flight_number}`).then(res=>res.json());
      }
    },
    rockets: {
      type: new GraphQLList(RocketType),
      resolve(parent, args) {
        return fetch('https://api.spacexdata.com/v3/rockets').then(res=>res.json()); 
      }
    },
    rocket: {
      type: RocketType,
      args: {
        id: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`https://api.spacexdata.com/v3/rockets/${args.id}`).then(res=>res.json());
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});