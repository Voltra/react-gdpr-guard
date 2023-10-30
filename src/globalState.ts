import { useEffect, useState, SetStateAction, Dispatch } from "react";

export type StoreUpdater<Store> = (store: Store) => Store;

export type EmitterSubscription<Store> = (store: Store) => void;

export type EmitterUnsubscriptionFunction = () => void;

export type StoreFactory<Store> = () => Store;

export type StoreHook<Store> = () => [
	store: Store,
	setStore: Dispatch<SetStateAction<Store>>
];

export type InitialStoreFactory<Store> = (
	get: StoreFactory<Store>,
	set: (updater: StoreUpdater<Store>) => Store
) => Store;

export interface StoreHolder<Store> {
	store: Store | null;
}

// cf. https://formidable.com/blog/2021/stores-no-context-api/
// cf. https://blog.axlight.com/posts/steps-to-develop-global-state-for-react/

export type CreateGlobalStore<Store> = [
	storeHolder: StoreHolder<Store>,
	useStore: StoreHook<Store>
];

export const createGlobalStore = <Store>(
	initialStoreFactory: InitialStoreFactory<Store>
): CreateGlobalStore<Store> => {
	let storeHolder: StoreHolder<Store> = {
		store: null,
	};
	const listeners = new Set<() => void>();

	const get = () => storeHolder.store!;
	const set = (updater: StoreUpdater<Store>) => {
		storeHolder.store = updater(get());
		listeners.forEach(listener => listener());
		return storeHolder.store;
	};

	storeHolder.store = initialStoreFactory(get, set);

	const setGlobalStore = (nextStore: Store | ((prevStore: Store) => Store)) => {
		if (typeof nextStore !== "function") {
			nextStore = () => (nextStore as Store);
		}

		set(nextStore as (prevStore: Store) => Store);
	};

	const useLocalStore: StoreHook<Store> = () => {
		// intitialize component with latest store
		const [localStore, setLocalStore] = useState<Store>(get());

		// update our local store when the global
		// store updates.
		//
		// emitter.subscribe returns a cleanup
		// function, so react will clean this
		// up on unmount.
		useEffect(() => {
			const listener = () => {
				setLocalStore(get());
			};

			listeners.add(listener);
			listener(); // in case it's already changed
			return () => {
				listeners.delete(listener);
			};
		}, []);
		return [localStore, setGlobalStore];
	};

	return [storeHolder, useLocalStore];
};
