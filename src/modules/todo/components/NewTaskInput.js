import React, { Component } from 'react';
import { Button, Keyboard, StyleSheet, TextInput } from "react-native";
import { Card } from "react-native-material-ui";
import { Mutation } from "react-apollo";
import { TASKS_QUERY, CREATE_TASK_MUTATION } from "../queries";
import moment from 'moment';


export default class NewTaskInput extends Component {

	constructor(props) {
		super(props);
		this.state = {
			text: '',
		};
		
		this.handleChangeText = this.handleChangeText.bind(this);
	}
	
	handleChangeText(text) {
		this.setState({text});
	}

	render() {
		let startDate = moment(this.props.currentDate).startOf('day');
		const endDate = moment(this.props.currentDate).startOf('day').add(1, 'day');
		return (
			<Mutation mutation={CREATE_TASK_MUTATION} variables={{title: this.state.text, taskDate: this.props.currentDate.getTime()}}>
				{
					mutate => {
						return (
							<Card>
								<TextInput
									style={styles.textInput}
									placeholder="Add a task"
									onChangeText={this.handleChangeText}
									value={this.state.text}
								/>
								<Button
									title="Submit"
									onPress={async() => {
										try {
											Keyboard.dismiss();
											const result = await mutate({
												update: (cache, {data}) => {
													if (data) {
														const { tasks } = cache.readQuery({query: TASKS_QUERY, variables:{startDate, endDate}});
														cache.writeQuery({
															query: TASKS_QUERY, variables:{startDate, endDate},
															data: {tasks: [...tasks, data.createTask]}
														});
													}
												}
											});
											this.setState({text: ''});
										} catch (e) {
											console.warn('error mutate', e);
										}
									}}
								/>
							</Card>)
					}
				}
			</Mutation>)
	}
}

const styles = StyleSheet.create({
	textInput: {
		marginHorizontal: 4,
	}
});
