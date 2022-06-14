import React, { Component } from 'react';

<<<<<<< HEAD
class ErrorBoundary extends React.Component {
=======
export class ErrorBoundary extends Component {
>>>>>>> 080e4fa063a47d8ced64ab24d18c323d9eecd56f
	constructor (props) {
		super(props);
		this.state = { hasError: false };
	}
<<<<<<< HEAD
	static getDerivedStateFromError (error) {
      return { hasError: true };
    }
=======

	static getDerivedStateFromError (error) {
		return { hasError: true };
	}
>>>>>>> 080e4fa063a47d8ced64ab24d18c323d9eecd56f

	componentDidCatch (error, errorInfo) {
		logErrorToMyService(error, errorInfo);
	}

	render () {
		if (this.state.hasError) {
			return <h1>Что-то пошло не так.</h1>;
		}

		return this.props.children; 
	}
}

export default ErrorBoundary;