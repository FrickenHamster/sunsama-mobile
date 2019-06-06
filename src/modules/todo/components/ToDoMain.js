import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from "react-native-material-ui/src";
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const TaskItem = ({task}) => {
	return (
		<Card>
			<View style={[styles.taskItemInner, task.completed ? styles.taskItemInnerCompleted : null]}>
				<Text style={styles.taskItemTitleText}>{task.title}</Text>
				<Ionicons
					name={task.completed ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline'}
					size={24}
					color={task.completed ? 'green' : 'black'}
				/>
			</View>
		</Card>
	)
};

export default class ToDoMain extends Component {

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerDay}>Tuesday <Entypo
						name="triangle-up" size={18}/>
					</Text>
					<Text style={styles.headerDate}>May 7</Text>
				</View>
				<TaskItem
					task={{
						title: 'Schedule demo with Airbnb',
						completed: false
					}}
				/>
				<TaskItem
					task={{
						title: 'Review design feedback on plan your day mockups',
						completed: true,
					}}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 24,
	},
	header: {
		marginBottom: 28,
		paddingLeft: 6,
	},
	headerDay: {
		fontFamily: 'Roboto-Bold',
		fontSize: 32,
		color: 'black'
	},
	headerDate: {
		color: '#5d5d5d',
		fontSize: 14
	},
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

