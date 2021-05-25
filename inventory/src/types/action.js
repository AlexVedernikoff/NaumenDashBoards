
// @flow
export type ActionType = 'open_link' | 'change_responsible' | 'change_state';

export type Action = {
	type: ActionType,
	link: string,
	name: string,
	inPlace?: false,
	states: Array<string>
};
