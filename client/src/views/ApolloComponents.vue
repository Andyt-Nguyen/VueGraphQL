<template>
	<div>
		<!-- Getting All Users and rendering -->
		<ApolloQuery
			:query="require('../graphql/queries/AllUsersWithCompanies.js').default"
		>
			<template v-slot="{ result: { loading, data, error } }">
				<div v-if="loading">Loading</div>
				<div v-else-if="error">There was an error {{ error.message }}</div>
				<div v-else-if="data">
					<div :key="user.id" v-for="user in data.users">
						<p>
							{{ `${user.company.name} - ${user.firstName} ${user.lastName} ` }}
						</p>
					</div>
				</div>
			</template>
		</ApolloQuery>

		<!-- Adding a user mutation -->
		<!-- Notice how it takes variables -->
		<ApolloMutation
			:mutation="require('../graphql/mutations/AddUser.js').default"
			:variables="{ firstName, lastName, companyId }"
			:update="updateCache"
		>
			<template v-slot="{ mutate, loading, error }">
				<form @submit.prevent="mutate">
					<div>
						<label>First Name</label>
						<input type="text" v-model="firstName" />
					</div>

					<div>
						<label>Last Name</label>
						<input type="text" v-model="lastName" />
					</div>

					<!-- Looping through all the companies -->
					<ApolloQuery
						:query="require('../graphql/queries/AllCompanies').default"
					>
						<template
							v-slot="{ result: { data, loading: compLoad, error: compErr } }"
						>
							<div v-if="compLoad">Loading</div>
							<div v-if="compErr">There was an error getting companies</div>
							<div v-if="data">
								<label>Company</label>
								<select v-model="companyId">
									<option
										v-for="company in data.companies"
										:key="company.id"
										:value="company.id"
									>
										{{ company.name }}
									</option>
								</select>
							</div>
						</template>
					</ApolloQuery>
					<!-- ------------------------------------- -->
					<button type="submit">Add</button>
				</form>
			</template>
		</ApolloMutation>
	</div>
</template>

<script>
import AllUsersQuery from '../graphql/queries/AllUsersWithCompanies.js';
export default {
	name: 'ApolloComponents',
	data: () => ({
		firstName: '',
		lastName: '',
		companyId: ''
	}),

	methods: {
		// updateCache in used on the mutation becuase
		// when the user submits they will not see the immediate change
		// until they refresh the page. What we are doing here is
		// updating the cache so the user can see immediate feedback
		updateCache(store, { data }) {
			const { users } = store.readQuery({ query: AllUsersQuery });
			store.writeQuery({
				query: AllUsersQuery,
				data: {
					users: [...users, data.addUser]
				}
			});
		}
	}
};
</script>
