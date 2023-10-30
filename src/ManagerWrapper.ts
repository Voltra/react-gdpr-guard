import type {
	GdprManager,
	GdprManagerRaw,
	GdprGuard,
	GdprGuardGroup,
	GdprStorage,
	GdprManagerEventHub,
} from "gdpr-guard";

import { StoreHolder } from "./globalState";
import type { MethodNamesOf } from "./typings";
import { ArgumentsOf } from "./typings";

export interface ReactGdprGuardGlobalStore {
	materializedState: GdprManagerRaw;
	update(manager: GdprManagerRaw): ReactGdprGuardGlobalStore;
}

export class ManagerWrapper {
	/* eslint-disable no-useless-constructor, no-empty-function */
	constructor(
		protected _manager: GdprManager,
		protected _globalStoreHolder: StoreHolder<ReactGdprGuardGlobalStore>
	) {}
	/* eslint-enable no-useless-constructor, no-empty-function */

	public get manager(): GdprManager {
		return this._manager;
	}

	public get materializedState(): GdprManagerRaw {
		return this._globalStoreHolder.store!.materializedState;
	}

	public triggerUpdate(): void {
		this._globalStoreHolder.store!.update(this.generateRawManager());
	}

	public get bannerWasShown(): boolean {
		return this.manager.bannerWasShown;
	}

	public get events(): GdprManagerEventHub {
		return this.manager.events;
	}

	public closeBanner(): void {
		this.manager.closeBanner();
		this.triggerUpdate();
	}

	public resetAndShowBanner(): void {
		this.manager.resetAndShowBanner();
		this.triggerUpdate();
	}

	public json(): GdprManagerRaw {
		return this.materializedState;
	}

	public toString(): string {
		return JSON.stringify(this.materializedState);
	}

	public disable(target?: string): this {
		return this.wrap("disable", target);
	}

	public enable(target?: string): this {
		return this.wrap("enable", target);
	}

	public toggle(target?: string): this {
		return this.wrap("toggle", target);
	}

	public disableForStorage(storageType: GdprStorage): this {
		this.manager.disableForStorage(storageType);
		return this;
	}

	public enableForStorage(storageType: GdprStorage): this {
		this.manager.enableForStorage(storageType);
		return this;
	}

	public toggleForStorage(storageType: GdprStorage): this {
		this.manager.toggleForStorage(storageType);
		return this;
	}

	public isEnabled(name: string): boolean {
		return this.manager.isEnabled(name);
	}

	public hasGroup(groupName: string): boolean {
		return this.manager.hasGroup(groupName);
	}

	public hasGuard(guardName: string): boolean {
		return this.manager.hasGuard(guardName);
	}

	public getGroup(groupName: string): GdprGuardGroup | null {
		return this.manager.getGroup(groupName);
	}

	public getGuard(guardName: string): GdprGuard | null {
		return this.manager.getGuard(guardName);
	}

	protected generateRawManager(): GdprManagerRaw {
		return this.manager.raw();
	}

	public hotswap(newManager: GdprManager): this {
		this._manager = newManager;
		this.triggerUpdate();
		return this;
	}

	protected wrap<Method extends MethodNamesOf<GdprGuard>>(
		method: Method,
		target?: string,
		...args: ArgumentsOf<GdprGuard[Method]>
	): this {
		if (
			typeof target === "undefined" &&
			typeof this.manager[method] === "function"
		) {
			// False positive of TS2349 or TS2684
			// @ts-ignore
			this.manager[method](...args);
			this.triggerUpdate();
		} else if (this.manager.hasGuard(target!)) {
			const guard = this.manager.getGuard(target!);

			if (typeof guard?.[method] === "function") {
				// False positive of TS2349 or TS2684
				// @ts-ignore
				guard?.[method](...args);
				this.triggerUpdate();
			}
		}

		return this;
	}
}
