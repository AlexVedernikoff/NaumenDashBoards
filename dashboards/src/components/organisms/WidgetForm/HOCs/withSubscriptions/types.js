// @flow
import {SUBSCRIBE_COMMANDS} from './constants';

export type SubscribeCommand = $Keys<typeof SUBSCRIBE_COMMANDS>;

export type SubscribeAction = () => Promise<void>;

export type Subscriptions = {[action: SubscribeCommand]: SubscribeAction[]};

export type SubscribeContext = {
	subscribe: (action: SubscribeCommand, handle: SubscribeAction) => void,
	unsubscribe: (action: SubscribeCommand, handle: SubscribeAction) => void,
};

export type Emitter = {
	emit: ((action: SubscribeCommand) => Promise<void>) | null
};

export type Props = {
	children: React$Node,
	emitterRef: Emitter
};
