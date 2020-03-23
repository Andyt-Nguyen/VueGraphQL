import gql from 'graphql-tag';

export default gql`
	query AllUsers {
		users {
			id
			firstName
			lastName
			company {
				name
			}
		}
	}
`;
