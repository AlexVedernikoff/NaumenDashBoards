// @flow
import {connect} from 'react-redux';
import {convertToRaw} from 'draft-js';
import type {EditorState} from 'components/atoms/TextEditor/types';
import Form from 'components/organisms/TextWidgetForm';
import {functions, props} from './selectors';
import type {Props, Values} from './types';
import React, {PureComponent} from 'react';
import type {RenderProps} from 'components/organisms/WidgetForm/types';
import WidgetForm from 'components/organisms/WidgetForm';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class TextWidgetForm extends PureComponent<Props> {
	getEditorText = (editorState: EditorState): string => {
		const content = convertToRaw(editorState.getCurrentContent());

		return content.blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
	};

	handleSubmit = (values: Values) => {
		const {save, widget} = this.props;
		const {id} = widget;
		const {
			displayMode,
			editorState,
			textSettings
		} = values;
		const content = convertToRaw(editorState.getCurrentContent());
		const text = this.getEditorText(editorState);

		save({
			displayMode,
			id,
			text,
			textSettings: {
				...textSettings,
				content
			},
			type: WIDGET_TYPES.TEXT,
			variables: {}
		});
	};

	renderForm = (props: RenderProps<Values>) => <Form {...props} />;

	render () {
		const {changeValues, onCancel, saving, values} = this.props;

		return (
			<WidgetForm
				initialValues={values}
				onCancel={onCancel}
				onChange={changeValues}
				onSubmit={this.handleSubmit}
				render={this.renderForm}
				submitting={saving}
			/>
		);
	}
}

export default connect(props, functions)(TextWidgetForm);
