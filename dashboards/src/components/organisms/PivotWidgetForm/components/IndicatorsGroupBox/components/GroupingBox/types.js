// @flow
export type Props = {
	checked: boolean,
	className: string,
	hasSum: boolean,
	name: string,
	onChangedHasSum: (value: boolean) => void,
	onChangedName: (value: string) => void,
	onChecked: () => void,
	onDelete: () => void,
	size: number,
	style: CSSStyleDeclaration,
	width: number
};
