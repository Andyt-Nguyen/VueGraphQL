import gql from 'graphql-tag';

export default gql`
  mutation addUser($firstName: String!, $lastName: String!, $companyId: String!) {
    addUser(firstName: $firstName, lastName: $$lastName, companyId: $companyId) {
      firstName
      lastName
    }
  }
`;
