// @flow
import AccessIcon from 'icons/form/checked.svg';
import {Button, Select} from 'components/atoms';
import CancelIcon from 'icons/header/close.svg';
import {components} from 'react-select';
import {Formik} from 'formik';
import type {FormikProps} from 'formik';
import {initialValues, schema} from './constants';
import type {Props, State, Values} from './types';
import React, {Fragment, PureComponent} from 'react';
import {SETTINGS} from 'components/organisms/WidgetFormPanel';
import styles from './styles.less';

class Control extends PureComponent<Props, State> {
	state = {
		showForm: false
	};

	handleShowForm = (showForm: boolean) => () => this.setState({showForm});

	handleSubmit = ({constant}: Values) => {
		const {data, onCreateConstant} = this.props;

		onCreateConstant(data.name, constant);
		this.handleShowForm(false)();
	};

	stopPropagation = (e: SyntheticMouseEvent<HTMLElement>) => {
		e.stopPropagation();
	};

	renderMenuListWithCreator = (props: any) => (
		<components.MenuList {...props}>
			<Button className={styles.createConstButton} onClick={this.handleShowForm(true)}>
				Создать
			</Button>
			{props.children}
		</components.MenuList>
	);

	renderFormContent = (props: FormikProps) => {
		const {handleChange, handleSubmit, values} = props;

		return (
			<Fragment>
				<input className={styles.input} type="text" name="constant" onChange={handleChange} value={values.constant}/>
				<AccessIcon className={styles.iconSuccess} onMouseDown={this.stopPropagation} onClick={handleSubmit}/>
				<CancelIcon className={styles.iconCancel} onMouseDown={this.stopPropagation} onClick={this.handleShowForm(false)}/>
			</Fragment>
		);
	};

	renderForm = ({ children, ...props }: any) => {
		const {showForm} = this.state;

		return (
			<components.ValueContainer {...props}>
				{showForm && (
					<Formik
						initialValues={initialValues}
						onSubmit={this.handleSubmit}
						render={this.renderFormContent}
						validationSchema={schema} />
				)}
				{children}
			</components.ValueContainer>
		);
	};

	render () {
		const {attr, data, handleSelect, options} = this.props;
		const {name, value} = data;
		const components = {
			DropdownIndicator: null,
			MenuList: this.renderMenuListWithCreator,
			ValueContainer: this.renderForm
		};

		const attrProps = attr ? SETTINGS.ATTR_SELECT_PROPS : {};

		return (
			<div className={styles.container} key={name}>
				<Select
					isSearchable={false}
					components={components}
					name={name}
					options={options}
					onSelect={handleSelect}
					placeholder="..."
					value={value}
					{...attrProps}
				/>
			</div>
		);
	}
}

export default Control;
