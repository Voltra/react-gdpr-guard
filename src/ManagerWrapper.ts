import type { GdprManager, GdprManagerRaw, GdprGuard } from "gdpr-guard";

export class ManagerWrapper {
	protected state: GdprManagerRaw;

	constructor(public readonly manager: GdprManager) {
		this.state = this.generateRawManager();
	}

	public get materializedState(): GdprManagerRaw {
		return this.state;
	}

	public triggerUpdate() {
		this.state = this.generateRawManager();
	}

	public json() {
		return this.materializedState;
	}

	public toString() {
		return JSON.stringify(this.materializedState);
	}

	public disable(target?: string) {
		return this.wrap("disable", target);
	}

	public enable(target?: string) {
		return this.wrap("enable", target);
	}

	public toggle(target?: string) {
		return this.wrap("toggle", target);
	}

	protected generateRawManager() {
		return this.manager.raw();
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
			return this;
		}

		if (this.manager.hasGuard(target)) {
			const guard = this.manager.getGuard(target);

			if (typeof guard?.[method] === "function") {
				guard?.[method](...args);
				this.triggerUpdate();
			}
		}

		return this;
	}
}
