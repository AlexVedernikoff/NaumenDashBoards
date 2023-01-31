import React, {Component} from 'react';

interface Props {
	children?: ReactNode;
}

interface State {
	error: boolean;
}

export class ErrorBoundary extends Component {
	state: State = {
		error: false
	};

	static getDerivedStateFromError(): State {
		return { error: true };
	}

	render () {
		const {error} = this.state;

		if (error) {
			return <h1>Отображение не настроено. Требуется выполнить настройки</h1>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
