import React, { Component } from 'react';
import { Button, Keyboard, StyleSheet, TextInput } from "react-native";
import { Card } from "react-native-material-ui";
import { Mutation } from "react-apollo";
import { TASKS_QUERY, CREATE_TASK_MUTATION } from "../queries";


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
		return (
			<Mutation mutation={CREATE_TASK_MUTATION} variables={{title: this.state.text}}>
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
												refetchQueries: [
													{
														query: TASKS_QUERY,
													}
												]
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
