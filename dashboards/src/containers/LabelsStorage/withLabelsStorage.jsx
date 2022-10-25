// @flow
import type {InjectedProps, Label} from './types';
import {LABELS_STORAGE_CONTEXT} from './constants.js';
import React from 'react';

export const withLabelsStorage = <Config: {}>(Component: React$ComponentType<Config & InjectedProps>): React$ComponentType<Config> =>
	class WithLabelsStorage extends React.Component<Config> {
		labels: {[key: string]: Label} = {};

		clearLabels = () => {
			this.labels = {};
		};

		getHelpers = () => ({
			clearLabels: this.clearLabels,
			getLabels: this.getLabels,
			registerLabel: this.registerLabel,
			unregisterLabel: this.unregisterLabel
		});

		getLabels = () => Object.values(this.labels);

		registerLabel = (key: string, label: Label) => {
			this.labels[key] = label;
		};

		unregisterLabel = (key: string) => {
			if (key in this.labels) {
				delete this.labels[key];
			}
		};

		render () {
			return (
				<LABELS_STORAGE_CONTEXT.Provider value={this.getHelpers()}>
					<Component {...this.props} clearLabels={this.clearLabels} />
				</LABELS_STORAGE_CONTEXT.Provider>
			);
		}
	};

export default withLabelsStorage;
