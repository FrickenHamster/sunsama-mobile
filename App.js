/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import ToDoMain from "./src/modules/todo/components/ToDoMain";



type Props = {};
export default class App extends Component<Props> {
	render() {
		return (
			<View style={styles.container}>
				<ToDoMain/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
});
