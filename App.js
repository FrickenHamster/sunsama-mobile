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

import { graphql, ApolloProvider } from "react-apollo";
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache, inMemoryCache } from 'apollo-cache-inmemory';

const httpLink = createHttpLink({
	uri: 'http://10.0.2.2:8000/graphql',
});

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
});

type Props = {};
export default class App extends Component<Props> {
	render() {
		return (
			<View style={styles.container}>
				<ApolloProvider client={client}>
					<ToDoMain/>
				</ApolloProvider>
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
