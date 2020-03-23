const axios = require('axios');
const {
	GraphQLString,
	GraphQLList,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLNonNull
} = require('graphql');

const BASE_URL = 'http://localhost:3000';

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		company: {
			type: CompanyType,
			async resolve(parentValue, args) {
				const { data } = await axios.get(
					BASE_URL + '/companies/' + parentValue.companyId
				);
				return data;
			}
		}
	})
});

const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		employees: {
			type: new GraphQLList(UserType),
			async resolve(parentValue, args) {
				const { data } = await axios.get(
					BASE_URL + '/companies/' + parentValue.id + '/users'
				);
				return data;
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		users: {
			type: new GraphQLList(UserType),
			async resolve() {
				const { data } = await axios.get(BASE_URL + '/users');
				return data;
			}
		},

		user: {
			type: UserType,
			args: {
				id: { type: GraphQLString }
			},
			async resolve(parentVal, args) {
				const { data } = await axios.get(BASE_URL + '/users/' + args.id);
				return data;
			}
		},

		companies: {
			type: new GraphQLList(CompanyType),
			async resolve(parentVal, args) {
				const { data } = await axios.get(BASE_URL + '/companies');
				return data;
			}
		},

		company: {
			type: CompanyType,
			args: {
				id: { type: GraphQLString }
			},
			async resolve(parentValue, args) {
				const { data } = await axios.get(BASE_URL + '/companies/' + args.id);
				return data;
			}
		}
	}
});

const mutations = new GraphQLObjectType({
	name: 'Mutations',
	fields: () => ({
		addUser: {
			type: UserType,
			args: {
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				lastName: { type: new GraphQLNonNull(GraphQLString) },
				companyId: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(_, args) {
				const { data } = await axios.post(BASE_URL + '/users', {
					firstName: args.firstName,
					lastName: args.lastName,
					companyId: args.companyId
				});
				return data;
			}
		},

		updateUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				lastName: { type: GraphQLString },
				companyId: { type: GraphQLString }
			},
			async resolve(_, args) {
				const { data } = await axios.patch(BASE_URL + '/users/' + args.id, {
					firstName: args.firstName,
					lastName: args.lastName,
					companyId: args.companyId
				});
				return data;
			}
		},

		deleteUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(_, args) {
				const { data } = await axios.delete(BASE_URL + '/users/' + args.id);
				return data;
			}
		}
	})
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: mutations
});
