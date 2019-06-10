import React, { Component } from 'react';

import { SwipeListView } from "react-native-swipe-list-view";
import { Card } from "react-native-material-ui";
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import { Query } from "react-apollo";
import { COMPLETE_TASK, DELETE_TASK_MUTATION, TASKS_QUERY} from "../queries";
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
			dirs: {},
		}
	}
	
	inDate(date) {
		return moment(this.props.date).diff(moment(date), 'days') <= 0;
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
						const displayData = [
							...data.tasks.filter(item => (!item.completed && this.inDate(item.taskDate))),
							...data.tasks.filter(item => (item.completed && this.inDate(item.taskDate)))
						];
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

									client.mutate({
										variables: {_id: swipeData.key},
										mutation: DELETE_TASK_MUTATION,
										update: (cache, {data}) => {
											if (data.deleteTask.success) {
												const { tasks } = client.cache.readQuery({query: TASKS_QUERY, variables:{startDate, endDate}});
												cache.writeQuery({
													query: TASKS_QUERY, variables:{startDate, endDate},
													data: {tasks: tasks.filter(item => item._id !== swipeData.key)}
												})
											}
										}
										/*refetchQueries: [
											{
												query: TASKS_QUERY,
											}
										]*/
									});
								} else if (swipeData.value > 335){
									let task;
									for (const item of data.tasks)
										if (item._id === swipeData.key) {
											task = item;
											break;
										}
									if (task)
										this.props.onStartChangeTaskDate(task)
								}
							}}
							rightOpenValue={-375}
							stopRightSwipe={-375}
							stopLeftSwipe={375}
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
