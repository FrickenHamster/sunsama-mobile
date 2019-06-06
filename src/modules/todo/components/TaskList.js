import React, { Component } from 'react';

import { SwipeListView } from "react-native-swipe-list-view";
import { Card } from "react-native-material-ui";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import Ionicons from "react-native-vector-icons/dist/Ionicons";

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

export default class TaskList extends Component {
	
	render() {
		return (
			<SwipeListView
				useFlatList
				disableRightSwipe
				data={this.props.tasks}
				renderItem={(data, rowMap) => {
					return (
						<TouchableHighlight>

						<TaskItem
						task={data.item}
					/></TouchableHighlight>)

				}}
				renderHiddenItem={ (data, rowMap) => {
					return (
					<View style={{backgroundColor: 'red', flex: 1, marginHorizontal: 8, marginVertical: 5}}>
					</View>)
				}}
				
				onSwipeValueChange={(swipeData) => {
					console.log('swipe', swipeData);
				}}
				rightOpenValue={-300}
			/>
		)
	}

}


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
