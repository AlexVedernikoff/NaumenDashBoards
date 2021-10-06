// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ShowBox extends PureComponent<Props> {
	handleClick = () => {
		const {name, onChange, value} = this.props;
		onChange({name, value});
	};

	render () {
		const {checked, className} = this.props;
		const activeMarker = <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M8 3C4.81 3 2.10 5.07 1 8C2.10 10.92 4.81 13 8 13C11.18 13 13.89 10.92 15 8C13.89 5.07 11.18 3 8 3ZM8 11.33C6.24 11.33 4.81 9.84 4.81 8C4.81 6.16 6.24 4.66 8 4.66C9.75 4.66 11.18 6.16 11.18 8C11.18 9.84 9.75 11.33 8 11.33ZM8 6C6.94 6 6.09 6.89 6.09 8C6.09 9.10 6.94 10 8 10C9.05 10 9.90 9.10 9.90 8C9.90 6.89 9.05 6 8 6Z" fill="#595959" /></svg>;
		const marker = <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M13.90 2L2.58 14.15L3.46 14.97L5.66 12.61C6.39 12.86 7.18 13 8 13C11.18 13 13.89 10.92 15 8C14.54 6.78 13.80 5.70 12.86 4.87L14.78 2.81L13.90 2ZM10.99 6.88L9.90 8.05C9.88 9.10 9.09 9.94 8.09 9.99L7.00 11.16C7.31 11.27 7.65 11.33 8 11.33C9.75 11.33 11.18 9.84 11.18 8C11.18 7.60 11.11 7.23 10.99 6.88ZM6.09 8.18L8.12 6.00C8.0856 6.00 8.04 6 8 6C6.94 6 6.09 6.89 6.09 8C6.09 8.06 6.09 8.12 6.09 8.18ZM8 4.66C8.40 4.66 8.80 4.74 9.16 4.89L10.50 3.44C9.72 3.15 8.87 3 8 3C4.81 3 2.10 5.07 1 8C1.47 9.27 2.26 10.38 3.25 11.23L5.06 9.29C4.90 8.89 4.81 8.45 4.81 8C4.81 6.16 6.24 4.66 8 4.66Z" fill="#595959" fillRule="evenodd" /></svg>;

		return (
			<div className={cn(className, styles.icon, checked && styles.checked)} onClick={this.handleClick}>
				{checked ? activeMarker : marker}
			</div>
		);
	}
}

export default ShowBox;
