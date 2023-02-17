import { useEffect, useState } from "react";

export type StoreUpdater<Store> = (store: Store) => Store;

export type EmitterSubscription<Store> = (store: Store) => void;

export type StoreFactory<Store> = (
	get: () => Store,
	set: (updater: StoreUpdater<Store>) => Store
) => Store;

export interface StoreHolder<Store> {
	store: Store | null;
}

// cf. https://formidable.com/blog/2021/stores-no-context-api/

const createEmitter = <Store>() => {
	const subscriptions = new Map<Symbol, EmitterSubscription<Store>>();
	return {
		emit: (store: Store) => subscriptions.forEach(fn => fn(store)),
		subscribe: (fn: EmitterSubscription<Store>) => {
			// eslint-disable-next-line symbol-description
			const key = Symbol();
			subscriptions.set(key, fn);
			return function () {
				subscriptions.delete(key);
			};
		},
	};
};

export const createGlobalStore = <Store>(
	initialStoreFactory: StoreFactory<Store>
): [storeHolder: StoreHolder<Store>, useStore: () => Store] => {
	// create an emitter
	const emitter = createEmitter<Store>();

	const storeHolder: StoreHolder<Store> = {
		store: null,
	};
	const get = () => storeHolder.store!;
	const set = (updater: StoreUpdater<Store>) => {
		storeHolder.store = updater(get());
		// notify all subscriptions when the store updates
		emitter.emit(storeHolder.store);
		return storeHolder.store;
	};
	storeHolder.store = initialStoreFactory(get, set);

	return [
		storeHolder,
		() => {
			// intitialize component with latest store
			const [localStore, setLocalStore] = useState<Store>(get());

			// update our local store when the global
			// store updates.
			//
			// emitter.subscribe returns a cleanup
			// function, so react will clean this
			// up on unmount.
			useEffect(() => emitter.subscribe(setLocalStore), []);
			return localStore;
		},
	];
};
