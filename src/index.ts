import { GdprManager } from "gdpr-guard";
import { GdprManagerEventHub } from "gdpr-guard/dist/GdprManagerEventHub";
import { DependencyList, useRef, useCallback, useMemo, useEffect } from "react";

import { ManagerWrapper } from "./ManagerWrapper";
import { SaviorWrapper } from "./SaviorWrapper";
import type {
	GdprSavior,
	GdprGuardRaw,
	GdprStorage,
	GdprManagerFactory,
	GdprGuardHooks,
	UseGdpr,
	UseSetupGdprEffect,
	UseGdprComputed,
	UseGdprGuard,
	UseGdprGuardEnabledState,
	UseGdprManager,
	UseGdprSavior,
	UseAttachGdprListenersEffect,
} from "./typings";

const useFunction = <Fn extends (...args: any[]) => any>(
	fn: Fn,
	deps: DependencyList = []
): Fn => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useCallback(fn, deps);
};

const useEffectOnSecondRender = <Fn extends (...args: any[]) => any>(
	fn: Fn,
	deps: DependencyList = []
) => {
	const didMount = useRef(false);

	useEffect(() => {
		if (didMount.current) {
			fn();
		}
		didMount.current = true;

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, fn, didMount]);
};

/**
 * Create hooks for the gdpr-guard library based on the provided {@link GdprSavior}
 * @param savior - The {@link GdprSavior} to wrap
 * @param managerFactory - A factory to the latest version of your {@link GdprManager}
 * @returns The React hooks associated to that {@link GdprSavior}
 */
export const createGdprGuardHooks = (
	savior: GdprSavior,
	managerFactory: GdprManagerFactory
): GdprGuardHooks => {
	// Use a dummy manager that'll be hotswap later after init
	const dummyManager = GdprManager.create([]);
	const managerWrapper = new ManagerWrapper(dummyManager);

	const saviorWrapper = new SaviorWrapper(savior, managerWrapper);

	const useSetupGdprEffect: UseSetupGdprEffect = () => {
		const restoreManagerOnBoot = useFunction(() => {
			(async () => {
				await saviorWrapper.restoreOrCreate(managerFactory);
			})();
		});

		useEffectOnSecondRender(restoreManagerOnBoot);

		// Auto-close
		useEffect(() => {
			if (managerWrapper.bannerWasShown) {
				managerWrapper.closeBanner();
			}
		}, [managerWrapper.manager]);
	};

	const useGdprComputed: UseGdprComputed = <T>(
		factory: () => T,
		deps: DependencyList = []
	): T => {
		const fn = useFunction(factory, deps);

		return useMemo(fn, [managerWrapper.materializedState, fn]);
	};

	const useGdprSavior: UseGdprSavior = (): GdprSavior => saviorWrapper;

	const useGdprManager: UseGdprManager = (): ManagerWrapper => managerWrapper;

	const useAttachGdprListenersEffect: UseAttachGdprListenersEffect = (
		callback: (eventHub: GdprManagerEventHub) => void
	) => {
		const manager = useGdprManager();

		useEffect(() => {
			const { events } = manager.manager;
			callback(events);
		}, [callback, manager.manager]);
	};

	const useGdprGuardEnabledState: UseGdprGuardEnabledState = (
		guardName: string
	) => {
		return useGdprComputed(() => {
			return managerWrapper.getGuard(guardName)?.enabled ?? false;
		}, [guardName]);
	};

	const useGdprGuard: UseGdprGuard = (guardName: string) => {
		const guard = useGdprComputed(() => {
			return managerWrapper.getGuard(guardName)?.raw();
		}, [guardName]) as GdprGuardRaw | null;

		const enableGuard = useFunction(() => {
			managerWrapper.enable(guardName);
		}, [guardName]);

		const disableGuard = useFunction(() => {
			managerWrapper.disable(guardName);
		}, [guardName]);

		const toggleGuard = useFunction(() => {
			managerWrapper.toggle(guardName);
		}, [guardName]);

		return {
			guard,
			enableGuard,
			disableGuard,
			toggleGuard,
		};
	};

	const useGdpr: UseGdpr = () => {
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

		const closeGdprBanner = useFunction(() => managerWrapper.closeBanner());
		const resetAndShowBanner = useFunction(() =>
			managerWrapper.resetAndShowBanner()
		);
		const bannerWasShown = useFunction(() => managerWrapper.bannerWasShown);

		return {
			// Meta
			closeGdprBanner,
			resetAndShowBanner,
			bannerWasShown,
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
		useSetupGdprEffect,
		useAttachGdprListenersEffect,

		useGdprSavior,
		useGdprManager,
		useGdprComputed,

		useGdprGuardEnabledState,
		useGdprGuard,
		useGdpr,
	};
};
