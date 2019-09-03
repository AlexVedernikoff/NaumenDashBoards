// @flow
import ButtonWithCounter from 'components/ButtonWithCounter';
import jsLogo from 'images/Unofficial-JavaScript-logo.png';
import React, {Component} from 'react';
import styles from './App.less';

export class App extends Component<{}> {
	render () {
		return (
			<div>
				<h1 className={styles.heading}>Hello, World!</h1>
				<figure>
					<p><img src={jsLogo} alt="Unofficial JavaScript logo" /></p>
					<figcaption className={styles.caption}>Пример изображения</figcaption>
				</figure>
				<ButtonWithCounter />
			</div>
		);
	}
}

export default App;
