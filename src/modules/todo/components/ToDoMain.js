import React, { Component } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import { Card, } from "react-native-material-ui/src";
import { Mutation, Query, withApollo } from 'react-apollo';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import gql from 'graphql-tag';
import moment from 'moment';

import TaskList from './TaskList';
import NewTaskInput from "./NewTaskInput";
import { Calendar } from "react-native-calendars";
import { CHANGE_TASK_DATE, TASK_DATES_QUERY, TASKS_QUERY } from "../queries";

import RNEventSource from 'react-native-event-source';
import { BACKEND } from "../../shared/constants";


class ToDoMain extends Component {

	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			calendarStatus: 'none',
			changeTask: null,
			taskDates: [],
		};

		this.handleHeaderPress = this.handleHeaderPress.bind(this);
		this.handleChangeDisplayDate = this.handleChangeDisplayDate.bind(this);
		this.handleStartChangeTaskDate = this.handleStartChangeTaskDate.bind(this);
	}

	async componentDidMount() {
		/*const evtSource = new EventSource('http://10.0.2.2:8000/events');
		evtSource.addEventListener('poop', event =>
			console.log(event));*/
		const eventSource = new RNEventSource(`${BACKEND}/events`);
		eventSource.addEventListener('taskEvent', async event => {
			console.log('got event', event)
			this.props.client.reFetchObservableQueries();
			const result = await this.props.client.query({
				query: TASK_DATES_QUERY,
			});
			this.setState({taskDates: result.data.taskDays.map(item => moment(item).format('YYYY-MM-DD'))});
		});
		
		const result = await this.props.client.query({
			query: TASK_DATES_QUERY,
		});
		this.setState({taskDates: result.data.taskDays.map(item => moment(item).format('YYYY-MM-DD'))});
	}

	handleHeaderPress() {
		this.setState({calendarStatus: this.state.calendarStatus === 'none' ? 'current' : 'none'})
	}

	handleChangeDisplayDate(day) {
		this.setState({
			date: moment().date(day.day).month(day.month - 1).year(day.year).toDate(),
			calendarStatus: 'none',
		});
		this.setState({calendarStatus: this.state.calendarStatus === 'none' ? 'current' : 'none'})
	}

	handleStartChangeTaskDate(task) {
		this.setState({calendarStatus: 'taskDate', changeTask: task})
	}

	handleChangeTaskDate(day) {

	}

	render() {
		const mm = moment(this.state.date);
		const dayOfWeekText = mm.format('dddd');
		const dateText = mm.format('MMMM Do');
		
		const taskMarkDates = {};
		for (const date of this.state.taskDates) {
			taskMarkDates[date] = {marked: true};
		}
		taskMarkDates[moment(this.state.date).format('YYYY-MM-DD')] = {selected: true};

		return (
			<View style={styles.container}>
				<TouchableOpacity
					onPress={this.handleHeaderPress}
				>
					<View style={styles.header}>
						<Text style={styles.headerDay}>{dayOfWeekText}
							<Entypo
								name={this.state.calendarStatus === 'none' ? 'triangle-down' : 'triangle-up'}
								size={18}
							/>
						</Text>
						<Text style={styles.headerDate}>{dateText}</Text>
					</View>
				</TouchableOpacity>
				{
					(this.state.calendarStatus !== 'none') &&
					<Mutation
						mutation={CHANGE_TASK_DATE}
					>
						{
							mutate => {
								return (<Calendar
									style={{
										borderTopWidth: 1,
										paddingTop: 5,
										borderBottomWidth: 1,
										borderColor: '#eee',
										height: 300
									}}

									current={moment(this.state.date).format('YYYY-MM-DD')}
									onDayPress={this.state.calendarStatus === 'current' ?
										this.handleChangeDisplayDate
										: (async day => {
											try {
												await mutate({
													variables: {
														_id: this.state.changeTask._id,
														taskDate: moment().date(day.day).month(day.month - 1).year(day.year).toDate(),
													},
													update: (cache, {data}) => {
														if (data) {
															
															console.log('asdf',data, cache);
														}
													}
												})
											} catch (e) {
												console.warn('error setting date', e);
												Alert.alert('Error changing task date', 'please try again')
											}
											this.setState({calendarStatus: 'none'});
										})}
									markedDates={taskMarkDates}
								/>);
							}
						}

					</Mutation>
				}
				<NewTaskInput
					currentDate={this.state.date}
				/>
				<TaskList
					date={this.state.date}
					onStartChangeTaskDate={this.handleStartChangeTaskDate}
				/>
			</View>
		)
	}
}

export default withApollo(ToDoMain);

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


