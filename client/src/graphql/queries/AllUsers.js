import gql from 'graphql-tag';

export default gql`
	query allUsers {
		id
		firstName
		lastName
	}
`;
