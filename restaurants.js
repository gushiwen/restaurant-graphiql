var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

//Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

var schema = buildSchema(`
  type Query {
    restaurant(id: Int): Restaurant
    restaurants: [Restaurant]
  }
  type Restaurant {
    id: Int
    name: String
    description: String
    dishes: [Dish]
  }
  type Dish {
    name: String
    price: Int
  }
  input RestaurantInput {
    id: Int
    name: String
    description: String
    dishes: [DishInput]
  }
  input DishInput {
    name: String
    price: Int
  }
  type DeleteResponse {
    ok: Boolean
  }
  type Mutation {
    setRestaurant(input: RestaurantInput): Restaurant
    deleteRestaurant(id: Int!): DeleteResponse
    editRestaurant(id: Int!, name: String!): Restaurant
  }

`);

//The root provides a resolver function for each API
var root = {
  restaurant: ({id}) => restaurants.find(element => element.id === id),
  restaurants: () => restaurants,
  setRestaurant: ({input}) => {
    restaurants.push({id:input.id,name:input.name,description:input.description,dishes:input.dishes})
    return input
  },
  deleteRestaurant: ({id}) => {
    let delRestaurant = restaurants.find(element => element.id === id)
    const ok = Boolean(delRestaurant)
    restaurants = restaurants.filter(element => element.id !== id)
    console.log("Deleted restaurant: " + JSON.stringify(delRestaurant))
    return {ok}
  },
  editRestaurant: ({id, ...restaurant}) => {
    if(!restaurants.find(element => element.id === id)) {
      throw new Error("Restaurant doesn't exist!")
    }
    restaurants = restaurants.map(element => {
      if (element.id === id) {
        return {...element, ...restaurant}
      }
      return element
    })
    return restaurants.find(element => element.id === id)
  }
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
