import {action} from '@storybook/addon-actions';
import Button, {VARIANTS} from 'components/Button';
import DropdownMenu from './DropdownMenu';
import {Item} from 'rc-menu';
import React, {useState} from 'react';

export default {
	component: DropdownMenu,
	title: 'Atoms/DropdownMenu'
};

const Template = args => {
	const [showMenu, setShowMenu] = useState(false);
	const [type, setType] = useState(VARIANTS.INFO);

	const onClick = () => {
		action('onButtonClick')();
		setShowMenu(!showMenu);
	};

	const onSelect = (target) => {
		action('onSelect')(target);
		setType(target);
		setShowMenu(!showMenu);
	};

	const onToggle = () => {
		action('onToggle')();
		setShowMenu(!showMenu);
	};

	const items = Object.keys(VARIANTS).map(name => <Item key={name} onClick={() => onSelect(name)}>{name}</Item>);

	const props = {...args, onSelect, onToggle};

	return (
		<div style={{position: 'relative', width: 250}}>
			<Button block={true} onClick={() => onClick()} variant={type}>Показать варианты кнопок</Button>
			{showMenu && <DropdownMenu {...props}>{items}</DropdownMenu>}
		</div>
	);
};

export const Default = Template.bind({});
