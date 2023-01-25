import {GraphQLFloat, GraphQLInt, GraphQLList} from "graphql";

const graphql = require('graphql');
import business from "./business/business.container";


const { GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLSchema } = graphql;


const OrderedProductsType = new GraphQLObjectType({
    name: 'OrderedProductsType',
    fields: () => ({
        amount: {type: GraphQLString},
        hint: {type: GraphQLString},
        name: {type: GraphQLString},
        productId: {type: GraphQLInt},
    })
})

const TableLabelsType = new GraphQLObjectType({
    name: 'TableLabelsType',
    fields: () => ({
        wartoscOdzywcza: {type: GraphQLString},
        wartoscEnergetyczna: {type: GraphQLString},
        tluszcz: {type: GraphQLString},
        wTymKwasyNasycone: {type: GraphQLString},
        weglowodany: {type: GraphQLString},
        wTymCukry: {type: GraphQLString},
        bialko: {type: GraphQLString},
        sol: {type: GraphQLString},
    })
})

const TableValuesType = new GraphQLObjectType({
    name: 'TableValuesType',
    fields: () => ({
        wartoscOdzywcza: {type: GraphQLString},
        wartoscEnergetyczna: {type: GraphQLString},
        tluszcz: {type: GraphQLString},
        wTymKwasyNasycone: {type: GraphQLString},
        weglowodany: {type: GraphQLString},
        wTymCukry: {type: GraphQLString},
        bialko: {type: GraphQLString},
        sol: {type: GraphQLString},
    })
})


const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: { type: GraphQLID  },
        bottle: {type: GraphQLString},
        name: { type: GraphQLString },
        tableLabels: {type: TableLabelsType},
        tableValues: {type: TableValuesType},
        category: { type: GraphQLString },
        price: {type: GraphQLFloat},
        netPrice: {type: GraphQLFloat},
        vat: {type: GraphQLFloat},
        hint: { type: GraphQLString }
    })
});

const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        orderedProducts: { type: OrderedProductsType },
        placementDate: { type: GraphQLString },
        totalPrice: { type: GraphQLString },
        email: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        product: {
            type: new GraphQLList(ProductType),
            args: { category: { type: GraphQLString } },
            async resolve(parent, args) {
                if(!args.category) {
                    return await business.getProductManager().get();
                }
                return await business.getProductManager().getProductsByCategory(args.category);
            }
        },
        order: {
            type: new GraphQLList(OrderType),
            async resolve() {
                return await business.getOrderManager().get();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
