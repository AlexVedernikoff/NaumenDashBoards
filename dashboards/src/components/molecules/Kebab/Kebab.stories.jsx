// @flow
import {action} from '@storybook/addon-actions';
import {ICON_NAMES} from 'components/atoms/Icon';
import Kebab from './Kebab';
import KebabDropdownButton from './components/KebabDropdownButton';
import KebabIconButton from './components/KebabIconButton';
import React, {Fragment} from 'react';

export default {
	argTypes: {
		width: {
			control: {max: 1000, min: 10, step: 10, type: 'range'}
		}
	},
	component: Kebab,
	title: 'Molecules/Kebab'
};

const Template = args => {
	const {width} = args;
	const menu1 = [
		{label: 'DATA1', value: 0},
		{label: 'DATA2', value: 1},
		{label: 'DATA3', value: 2}
	];
	const menu2 = [
		{label: 'BOLD', value: 0},
		{label: 'UNDERLINE', value: 1},
		{label: 'ITALIC', value: 2}
	];
	return (
		<div style={{border: 'dotted 1px #333', height: '1em', width}}>
			<Kebab>
				<KebabIconButton icon={ICON_NAMES.ALIGN_LEFT} onClick={action('ALIGN_LEFT')} text=" " />
				<KebabIconButton icon={ICON_NAMES.ALIGN_CENTER} onClick={action('ALIGN_CENTER')} text="ALIGN_CENTER" />
				<KebabIconButton icon={ICON_NAMES.ALIGN_RIGHT} onClick={action('ALIGN_RIGHT')} text="ALIGN_RIGHT" />
				<KebabIconButton icon={ICON_NAMES.ARROW_BOTTOM} onClick={action('ARROW_BOTTOM')} text="ARROW_BOTTOM" />
				<KebabIconButton icon={ICON_NAMES.ASC} onClick={action('ASC')} text="ASC" />
				<KebabIconButton icon={ICON_NAMES.DESC} onClick={action('DESC')} text="DESC" />
				<KebabDropdownButton icon={ICON_NAMES.DATA} onSelect={action('DATA')} options={menu1} text="DATA" />
				<KebabDropdownButton icon={ICON_NAMES.BOLD} onSelect={action('BOLD')} options={menu2} text="BOLD" value={1} />
			</Kebab>
		</div>
	);
};

export const Simple = Template.bind({});

Simple.args = {
	width: 120
};

const TemplateWithBoundaryConditions = args => {
	const {width} = args;
	const getNullIcons = () => null;
	const getFragment = () => (
		<Fragment>
			<KebabIconButton icon={ICON_NAMES.ALIGN_RIGHT} onClick={action('ALIGN_RIGHT')} text="ALIGN_RIGHT" />
			<KebabIconButton icon={ICON_NAMES.ARROW_BOTTOM} onClick={action('ARROW_BOTTOM')} text="ARROW_BOTTOM" />
		</Fragment>
	);
	return (
		<div style={{border: 'dotted 1px #333', height: '1em', width}}>
			<Kebab>
				<KebabIconButton icon={ICON_NAMES.ALIGN_LEFT} onClick={action('ALIGN_LEFT')} text=" " />
				{getNullIcons()}
				<KebabIconButton icon={ICON_NAMES.ALIGN_CENTER} onClick={action('ALIGN_CENTER')} text="ALIGN_CENTER" />
				{getFragment()}
			</Kebab>
		</div>
	);
};

export const BoundaryConditions = TemplateWithBoundaryConditions.bind({});

BoundaryConditions.args = {
	width: 120
};
