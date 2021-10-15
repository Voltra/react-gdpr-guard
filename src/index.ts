import type { GdprSavior, GdprGuardRaw, GdprStorage } from "gdpr-guard";
import type { DependencyList } from "react";

import { GdprManager } from "gdpr-guard";
import { useCallback, useMemo } from "react";
import { ManagerWrapper } from "./ManagerWrapper";
import { SaviorWrapper } from "./SaviorWrapper";

const useFunction = <Fn extends (...args: any[]) => any>(fn: Fn): Fn => {
	return useCallback(fn, []);
};

export const createGdprGuardHooks = (savior: GdprSavior) => {
	const dummyManager = GdprManager.create([]);
	const managerWrapper = new ManagerWrapper(dummyManager);

	const saviorWrapper = new SaviorWrapper(savior, managerWrapper);

	const useGdprComputed = <T>(
		compute: () => T,
		deps: DependencyList = [],
	): T => {
		return useMemo(compute, [managerWrapper.materializedState, ...deps]);
	};

	const useGdprSavior = (): GdprSavior => saviorWrapper;

	const useGdprManager = (): ManagerWrapper => managerWrapper;

	const useGdprGuardEnabledState = (guardName: string) => {
		return useGdprComputed(() => {
			return managerWrapper.getGuard(guardName)?.enabled ?? false;
		});
	};

	const useGdprGuard = (guardName: string) => {
		const guard = useGdprComputed(() => {
			return managerWrapper.getGuard(guardName)?.raw();
		}) as GdprGuardRaw | null;

		const enableGuard = useFunction(() => {
			managerWrapper.enable(guardName);
		});

		const disableGuard = useFunction(() => {
			managerWrapper.disable(guardName);
		});

		const toggleGuard = useFunction(() => {
			managerWrapper.toggle(guardName);
		});

		return {
			guard,
			enableGuard,
			disableGuard,
			toggleGuard,
		};
	};

	const useGdpr = () => {
		// Manager
		const manager = useGdprComputed(() => managerWrapper.materializedState);

		const enableManager = useFunction(() => {
			managerWrapper.enable();
		});

		const disableManager = useFunction(() => {
			managerWrapper.disable();
		});

		const toggleManager = useFunction(() => {
			managerWrapper.toggle();
		});

		// Guard/group
		const enableGuard = useFunction((guardName: string) => {
			managerWrapper.enable(guardName);
		});

		const disableGuard = useFunction((guardName: string) => {
			managerWrapper.disable(guardName);
		});

		const toggleGuard = useFunction((guardName: string) => {
			managerWrapper.toggle(guardName);
		});

		const guardIsEnabled = useFunction((guardName: string) => {
			return managerWrapper.isEnabled(guardName);
		});

		// Storage
		const enableForStorage = useFunction((storage: GdprStorage) => {
			managerWrapper.enableForStorage(storage);
		});

		const disableForStorage = useFunction((storage: GdprStorage) => {
			managerWrapper.disableForStorage(storage);
		});

		const toggleForStorage = useFunction((storage: GdprStorage) => {
			managerWrapper.toggleForStorage(storage);
		});

		return {
			// Manager
			manager,
			enableManager,
			disableManager,
			toggleManager,
			// Guard/group
			enableGuard,
			disableGuard,
			toggleGuard,
			guardIsEnabled,
			// Storage
			enableForStorage,
			disableForStorage,
			toggleForStorage,
		};
	};

	return {
		useGdprSavior,
		useGdprManager,
		useGdprComputed,

		useGdprGuardEnabledState,
		useGdprGuard,
		useGdpr,
	};
};
