// @flow
export type State = {
	currentTab: string
}

export type TabParams = {
	key: string,
	title: string
}

export type CreateFormData = {
	name: string,
	type: string,
	[string]: any
};

export type SaveFormData = {
	id: string
} & CreateFormData;

export type FormData = SaveFormData | CreateFormData;

export type SelectValue = {
	[string]: any
};

export type WrappedProps = {
	[string]: any
};
