import {GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull} from "graphql";

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

const OrderedProductsInputType = new GraphQLInputObjectType({
    name: 'OrderedProductsInputType',
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
        kationy: {type: GraphQLString},
        wapniowy: {type: GraphQLString},
        magnezowy: {type: GraphQLString},
        sodowy: {type: GraphQLString},
        potasowy: {type: GraphQLString},
        aniony: {type: GraphQLString},
        wodoroweglanowy: {type: GraphQLString},
        siarczanowy: {type: GraphQLString},
        chlorkowy: {type: GraphQLString},
        fluorkowy: {type: GraphQLString},
        suma: {type: GraphQLString},
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
        kationy: {type: GraphQLString},
        wapniowy: {type: GraphQLString},
        magnezowy: {type: GraphQLString},
        sodowy: {type: GraphQLString},
        potasowy: {type: GraphQLString},
        aniony: {type: GraphQLString},
        wodoroweglanowy: {type: GraphQLString},
        siarczanowy: {type: GraphQLString},
        chlorkowy: {type: GraphQLString},
        fluorkowy: {type: GraphQLString},
        suma: {type: GraphQLString},
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
        hint: { type: GraphQLString },
        number: { type: GraphQLInt }
    })
});

const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        orderedProducts: { type: new GraphQLList(OrderedProductsType)},
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
                if(args.category) {
                    return await business.getProductManager().getProductsByCategory(args.category);
                }
                return await business.getProductManager().get();
            }
        },
        order: {
            type: new GraphQLList(OrderType),
            args: { email: { type: GraphQLString } },
            async resolve(parent, args) {
                if(args.email) {
                    return await business.getOrderManager().getOrderByUserEmail(args.email);
                }
                return await business.getOrderManager().get();
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        makeOrder: {
            type: OrderType,
            args: {
                orderedProducts: {type: new GraphQLList(OrderedProductsInputType)},
                placementDate: {type: new GraphQLNonNull(GraphQLString)},
                totalPrice: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return await business.getOrderManager().makeOrder(args);
            }
        },
        deleteOrder: {
            type: OrderType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return await business.getOrderManager().deleteOrderById(args.id);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
