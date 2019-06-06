import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from "react-native-material-ui/src";
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import TaskList from './TaskList';

export default class ToDoMain extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			tasks: [
				{
					title: 'Schedule demo with Airbnb',
					completed: false
				},
				{
					title: 'Review design feedback on plan your day mockups your day mockups your day mockups your day mockups your day mockups your day mockups',
					completed: false,
				},
				{
					title: 'Review design feedback on plan your day mockups',
					completed: true,
				}
			]
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerDay}>Tuesday <Entypo
						name="triangle-up" size={18}/>
					</Text>
					<Text style={styles.headerDate}>May 7</Text>
				</View>
				<TaskList tasks={this.state.tasks}/>
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
});

