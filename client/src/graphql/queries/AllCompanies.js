import gql from 'graphql-tag';

export default gql`
	query allCompanies {
		companies {
			id
			name
		}
	}
`;
