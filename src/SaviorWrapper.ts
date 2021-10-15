import { GdprManager, GdprManagerFactory, GdprManagerRaw, GdprSaviorAdapter } from "gdpr-guard";
import type { GdprSavior } from "gdpr-guard";
import type { ManagerWrapper } from "./ManagerWrapper";

export class SaviorWrapper extends GdprSaviorAdapter {
	constructor(
		protected savior: GdprSavior,
		protected managerWrapper: ManagerWrapper,
	) {
		super();
	}

	async updateSharedManager(manager: GdprManager): Promise<void> {
		await this.savior.updateSharedManager(manager);

		if (this.managerWrapper.manager === manager) return;

		this.managerWrapper.hotswap(manager);
	}

	/// Delegates
	check() {
		return this.savior.check();
	}

	exists(shouldUpdate = true) {
		return this.savior.exists(shouldUpdate);
	}

	restore(shouldUpdate = true) {
		return this.savior.restore(shouldUpdate);
	}

	restoreOrCreate(factory: GdprManagerFactory) {
		return this.savior.restoreOrCreate(factory);
	}

	store(manager: GdprManagerRaw) {
		return this.savior.store(manager);
	}
}
