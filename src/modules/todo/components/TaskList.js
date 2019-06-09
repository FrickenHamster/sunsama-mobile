import React, { Component } from 'react';

import { SwipeListView } from "react-native-swipe-list-view";
import { Card } from "react-native-material-ui";
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import { Mutation, Query } from "react-apollo";
import { COMPLETE_TASK, CREATE_TASK_MUTATION, DELETE_TASK_MUTATION, TASKS_QUERY} from "../queries";
import moment from "moment";
import gql from "graphql-tag";


const GET_TASKS = gql`
	query GetTasks {
		tasks
	}
`;

const TaskItem = ({task, onCompletePress}) => {
	return (
		<Card>
			<View style={[styles.taskItemInner, task.completed ? styles.taskItemInnerCompleted : null]}>
				<Text style={styles.taskItemTitleText}>{task.title}</Text>
				<TouchableOpacity onPress={() => onCompletePress(!task.completed)}>
					<Ionicons
						name={task.completed ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline'}
						size={24}
						color={task.completed ? 'green' : 'black'}
					/>
				</TouchableOpacity>
			</View>
		</Card>
	)
};

class TaskList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dirs: {},
		}
	}

	render() {
		let startDate = moment(this.props.date).startOf('day');
		const endDate = moment(this.props.date).startOf('day').add(1, 'day');
		return (
			<Query query={TASKS_QUERY} variables={{startDate, endDate}}>
				{
					({loading, error, data, client}) => {
						if (loading)
							return <Text>loading</Text>
						if (error)
							return <Text>error {error}</Text>
						const displayData = [...data.tasks.filter(item => !item.completed), ...data.tasks.filter(item => item.completed)];
						return (<SwipeListView
							useFlatList
							data={displayData}
							renderItem={(data, rowMap) => {
								return (
									<TouchableHighlight>
										<TaskItem
											task={data.item}
											onCompletePress={completed => client.mutate({
												variables: {_id: data.item._id, completed},
												mutation: COMPLETE_TASK,
											})}
										/></TouchableHighlight>)

							}}
							renderHiddenItem={(data, rowMap) => {
								return (
									<View style={{
										alignItems: this.state.dirs[data.item._id] === 0 ? 'flex-start' : 'flex-end',
										backgroundColor: this.state.dirs[data.item._id] === 0 ? '#2ca7ff' : '#fb4a4a',
										flex: 1,
										marginHorizontal: 8,
										marginVertical: 5,
										justifyContent: 'center',
										paddingHorizontal: 12,
									}}>
										<Text
											style={{color: 'white'}}
										>{this.state.dirs[data.item._id] === 0 ? 'Move' : 'Delete'}</Text>
									</View>)
							}}

							onSwipeValueChange={(swipeData) => {
								if (swipeData.value > 0 && this.state.dirs[swipeData.key] !== 0) {
									this.setState({dirs: {...this.state.dirs, [swipeData.key]: 0}});
								} else if (swipeData.value < 0 && this.state.dirs[swipeData.key] !== 1)
									this.setState({dirs: {...this.state.dirs, [swipeData.key]: 1}});

								if (swipeData.value < -375) {

									console.log('deletes');
									client.mutate({
										variables: {_id: swipeData.key},
										mutation: DELETE_TASK_MUTATION,
										update: (cache, {data}) => {
											console.log('dats', data, data.success);
											if (data.deleteTask.success) {
												const tasks = cache.readQuery({query: TASKS_QUERY})
												console.log('potato', tasks);
												/*cache.writeQuery({
													query: GET_TASKS
												})*/
											}
											
											
										}
										/*refetchQueries: [
											{
												query: TASKS_QUERY,
											}
										]*/
									});
								} else if (swipeData.value > 375){
									
								}
							}}
							rightOpenValue={-375}
							keyExtractor={(rowData, index) => {
								return rowData._id;
							}}
						/>)
					}
				}
			</Query>

		)
	}

}

export default TaskList;


const styles = StyleSheet.create({
	taskItemInner: {
		padding: 8,
	},
	taskItemInnerCompleted: {
		opacity: 0.3,
	},
	taskItemTitleText: {
		color: 'black',
		fontFamily: 'Roboto-Regular',
		fontSize: 14,
		paddingBottom: 2
	}
});
