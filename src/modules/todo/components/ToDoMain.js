import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import { Card, } from "react-native-material-ui/src";
import { Query } from 'react-apollo';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import gql from 'graphql-tag';
import moment from 'moment';

import TaskList from './TaskList';
import NewTaskInput from "./NewTaskInput";
import { Calendar } from "react-native-calendars";
import { TASKS_QUERY } from "../queries";


export default class ToDoMain extends Component {

	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			calendarStatus: 'none',
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity
					onPress={() => {
						this.setState({calendarStatus: this.state.calendarStatus === 'none' ? 'current' : 'none'})
					}}
				>
					<View style={styles.header}>
						<Text style={styles.headerDay}>Tuesday
							<Entypo
								name={this.state.calendarStatus === 'none' ? 'triangle-down' : 'triangle-up' }
								size={18}
							/>
						</Text>
						<Text style={styles.headerDate}>May 7</Text>
					</View>
				</TouchableOpacity>
				{
					(this.state.calendarStatus !== 'none') &&
					<Calendar
						style={{
							borderTopWidth: 1,
							paddingTop: 5,
							borderBottomWidth: 1,
							borderColor: '#eee',
							height: 300
						}}

						current={moment(this.state.date).format('YYYY-MM-DD')}
						onDayPress={day => {
							console.log('sels', day);

							this.setState({date: moment(day.dateString, 'YYYY-MM-DD').toDate()})
						}}
						markedDates={{
							[moment(this.state.date).format('YYYY-MM-DD')]: {selected: true}
						}}
					/>
				}
				<NewTaskInput/>
				<Query query={TASKS_QUERY}>
					{({loading, error, data}) => {
						console.log(loading, error, data);
						if (loading) return <Text>Fetching</Text>
						if (error) return <Text>Error</Text>
						return (
							<TaskList tasks={data.tasks}/>
						)
					}}
				</Query>
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

