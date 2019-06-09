import gql from "graphql-tag";


export const TASKS_QUERY = gql`
query tasks($startDate: Date, $endDate: Date) {
  tasks(startDate: $startDate, endDate: $endDate) {
    _id
    taskDate
    title
    completed
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

export const COMPLETE_TASK = gql`
mutation completeTask($_id: ID!, $completed: Boolean!) {
  completeTask(_id: $_id, completed: $completed) {
    _id
    taskDate
    title
    completed
  }
}
`;

export const CHANGE_TASK_DATE = gql`
mutation completeTask($_id: ID!, $completed: Boolean!) {
  completeTask(_id: $_id, completed: $completed) {
    _id
    taskDate
    title
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
