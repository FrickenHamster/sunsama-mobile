import React, { Component } from 'react';

import { SwipeListView } from "react-native-swipe-list-view";
import { Card } from "react-native-material-ui";
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import { Mutation, Query } from "react-apollo";
import { COMPLETE_TASK, CREATE_TASK_MUTATION, DELETE_TASK_MUTATION, TASKS_QUERY } from "../queries";
import moment from "moment";

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
			dir: 0,
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
										backgroundColor: this.state.dir === 0 ? 'blue' : 'red',
										flex: 1,
										marginHorizontal: 8,
										marginVertical: 5
									}}>
									</View>)
							}}

							onSwipeValueChange={(swipeData) => {
								if (swipeData.value > 0 && this.state.dir === 1) {
									this.setState({dir: 0})
								} else if (swipeData.value < 0 && this.state.dir === 0)
									this.setState({dir: 1})

								if (swipeData.value < -375) {
									console.log('delete', swipeData);
									client.mutate({
										variables: {_id: swipeData.key},
										mutation: DELETE_TASK_MUTATION,
										refetchQueries: [
											{
												query: TASKS_QUERY,
											}
										]
									});
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
