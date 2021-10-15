import type {
	GdprManager,
	GdprManagerRaw,
	GdprGuard,
	GdprGuardGroup,
	GdprStorage,
} from "gdpr-guard";

export class ManagerWrapper {
	protected state: GdprManagerRaw;

	constructor(protected _manager: GdprManager) {
		this.state = this.generateRawManager();
	}

	public get manager(): GdprManager {
		return this._manager;
	}

	public get materializedState(): GdprManagerRaw {
		return this.state;
	}

	public triggerUpdate(): void {
		this.state = this.generateRawManager();
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

	protected wrap(
		method: keyof GdprGuard,
		target?: string,
		...args: unknown[]
	): this {
		if (
			typeof target === "undefined" &&
			typeof this.manager[method] === "function"
		) {
			this.manager[method](...args);
			this.triggerUpdate();
		} else if (this.manager.hasGuard(target as string)) {
			const guard = this.manager.getGuard(target as string);

			if (typeof guard?.[method] === "function") {
				guard?.[method](...args);
				this.triggerUpdate();
			}
		}

		return this;
	}
}
