import React, { Component } from 'react';
import { Button, Keyboard, StyleSheet, TextInput } from "react-native";
import moment from "./ToDoMain";
import { Calendar } from "react-native-calendars";

export default class NewTaskInput extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (<Calendar
			style={styles.calendar}
			current={this.props.current}
			onDayPress={day  => this.props.onDayPressed(day)}
			markedDates={{
				[moment(this.state.date).format('YYYY-MM-DD')]: {selected: true}
			}}
		/>);
	}
}


const styles = StyleSheet.create({
	calendar: {
		borderTopWidth: 1,
		paddingTop: 5,
		borderBottomWidth: 1,
		borderColor: '#eee',
		height: 300
	}
});
