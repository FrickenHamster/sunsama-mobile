import gql from "graphql-tag";


export const TASKS_QUERY = gql`{
  tasks {
    _id,
    title,
    completed,
    taskDate
  }
}
`;

export const CREATE_TASK_MUTATION = gql`
	mutation createTaskMutation($title: String!) {
		createTask(title: $title) {
		  _id,
		  title,
		  completed
		}
	  }
`;

export const DELETE_TASK_MUTATION = gql`
mutation deleteTaskMutation($_id: ID!) {
  deleteTask(_id: $_id) {
    success
    message
  }
}
`;
