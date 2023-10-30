import { SetStateAction, Dispatch } from "react";
export type StoreUpdater<Store> = (store: Store) => Store;
export type EmitterSubscription<Store> = (store: Store) => void;
export type EmitterUnsubscriptionFunction = () => void;
export type StoreFactory<Store> = () => Store;
export type StoreHook<Store> = () => [
    store: Store,
    setStore: Dispatch<SetStateAction<Store>>
];
export type InitialStoreFactory<Store> = (get: StoreFactory<Store>, set: (updater: StoreUpdater<Store>) => Store) => Store;
export interface StoreHolder<Store> {
    store: Store | null;
}
export type CreateGlobalStore<Store> = [
    storeHolder: StoreHolder<Store>,
    useStore: StoreHook<Store>
];
export declare const createGlobalStore: <Store>(initialStoreFactory: InitialStoreFactory<Store>) => CreateGlobalStore<Store>;
