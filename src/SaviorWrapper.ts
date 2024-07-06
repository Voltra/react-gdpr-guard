import {
	GdprSavior,
	GdprManager,
	GdprManagerFactory,
	GdprManagerRaw,
	GdprSaviorAdapter,
} from "gdpr-guard";

import { ManagerWrapper } from "./ManagerWrapper";

export class SaviorWrapper extends GdprSaviorAdapter {
	constructor(
		protected savior: GdprSavior,
		protected managerWrapper: ManagerWrapper
	) {
		super();
	}

	public override async updateSharedManager(
		manager: GdprManager
	): Promise<void> {
		if (this.managerWrapper.manager === manager) return;

		await this.savior.updateSharedManager(manager);
		this.managerWrapper.hotswap(manager);
	}

	/// Delegates
	public override check() {
		return this.savior.check();
	}

	public override exists(shouldUpdate = true) {
		return this.savior.exists(shouldUpdate);
	}

	public override restore(shouldUpdate = true) {
		return this.savior.restore(shouldUpdate);
	}

	public override restoreOrCreate(factory: GdprManagerFactory) {
		return this.savior.restoreOrCreate(factory);
	}

	public override store(manager: GdprManagerRaw) {
		return this.savior.store(manager);
	}

	public override decorate(manager: GdprManager): GdprManager {
		if (typeof this.savior.decorate !== "undefined") {
			return this.savior.decorate(manager);
		}

		return super.decorate(manager);
	}
}
