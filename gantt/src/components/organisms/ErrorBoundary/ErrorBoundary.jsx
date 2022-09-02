import React, { Component } from 'react';

export class ErrorBoundary extends Component {
	constructor (props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError () {
		return { hasError: true };
	}

	componentDidCatch (error, errorInfo) {
		console.log(error, errorInfo);
	}

	render () {
		if (this.state.hasError) {
			return <h1>Что-то пошло не так.</h1>;
		}

		return this.props.children; 
	}
}

export default ErrorBoundary;