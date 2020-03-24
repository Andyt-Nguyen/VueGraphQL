<template>
	<div class="about">
		<div v-if="$apollo.queries.users.loading">Loading...</div>
		<div :key="user.id" v-for="user in users">
			<p>
				{{ `${user.company.name} - ${user.firstName} ${user.lastName} ` }}
			</p>
		</div>

		<form @submit.prevent="addUser">
			<div>
				<label>First Name</label>
				<input type="text" v-model="firstName" />
			</div>

			<div>
				<label>Last Name</label>
				<input type="text" v-model="lastName" />
			</div>

			<label>Company</label>
			<select v-model="companyId">
				<option
					v-for="company in companies"
					:key="company.id"
					:value="company.id"
				>
					{{ company.name }}
				</option>
			</select>
			<button type="submit">Add</button>
		</form>
	</div>
</template>

<script>
import AllUsersWithCompaniesQuery from '../graphql/queries/AllUsersWithCompanies';
import AllCompaniesQuery from '../graphql/queries/AllCompanies';
import AddUserMutation from '../graphql/mutations/AddUser';
export default {
	name: 'ApolloEvent',
	data: () => ({
		users: [],
		companies: [],
		firstName: '',
		lastName: '',
		companyId: ''
	}),

	apollo: {
		users: AllUsersWithCompaniesQuery,
		companies: AllCompaniesQuery
	},

	methods: {
		async addUser() {
			await this.$apollo.mutate({
				mutation: AddUserMutation,
				variables: {
					firstName: this.firstName,
					lastName: this.lastName,
					companyId: this.companyId
				},
				update(store, { data }) {
					const { users } = store.readQuery({
						query: AllUsersWithCompaniesQuery
					});
					store.writeQuery({
						query: AllUsersWithCompaniesQuery,
						data: {
							users: [...users, data.addUser]
						}
					});
				}
			});
		}
	}
};
</script>
