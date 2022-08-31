import {action} from '@storybook/addon-actions';
import cn from 'classnames';
import Icon from './Icon';
import {ICON_NAMES} from './constants';
import React from 'react';
import styles from './styles.stories.less';
import {useArgs} from '@storybook/client-api';

export default {
	argTypes: {
		name: {
			control: {
				options: ICON_NAMES,
				type: 'select'
			}
		}
	},
	component: Icon,
	title: 'Atoms/Icon'
};

const Template = args => {
	return (
		<Icon {...args} />
	);
};

export const Icons = Template.bind({});

Icons.args = {
	height: 128,
	name: ICON_NAMES.ACCEPT,
	title: 'title',
	viewBox: '0 0 16 16',
	width: 128
};

const ListTemplate = args => {
	const [{name: selectedName}, updateArgs] = useArgs();

	const onClick = name => () => {
		action(name)(event);

		updateArgs({
			name
		});
	};

	const icons = Object.keys(ICON_NAMES).map(name => {
		const className = cn({
			[styles.item]: true,
			[styles.selectedItem]: name === selectedName
		});

		return (
			<div className={className} key={name} onClick={onClick(name)} title={name}>
				<Icon name={name} />
				<div className={styles.title}>{name}</div>
			</div>
		);
	});

	return (
		<div className={styles.container}>
			{icons}
		</div>
	);
};

export const IconsList = ListTemplate.bind({});
