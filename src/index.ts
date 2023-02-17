import type {
	GdprManagerFactory,
	GdprManagerRaw,
	GdprSavior,
	GdprManagerEventHub,
	GdprGuardRaw,
	GdprStorage,
} from "gdpr-guard";
import { GdprManager } from "gdpr-guard";
import { DependencyList, useRef, useCallback, useMemo, useEffect } from "react";

import { createGlobalStore } from "./globalState";
import { ManagerWrapper, ReactGdprGuardGlobalStore } from "./ManagerWrapper";
import { SaviorWrapper } from "./SaviorWrapper";
import type {
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

/**
 * Semantic wrapper around {@link useCallback}
 */
const useFunction = <Fn extends (...args: any[]) => any>(
	fn: Fn,
	deps: DependencyList = []
): Fn => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useCallback(fn, deps);
};

/**
 * {@link useEffect} but that will only be triggered after one render/call attempt as already been made
 */
const useEffectOnSecondRender = <Fn extends (...args: any[]) => any>(
	fn: Fn,
	deps: DependencyList = []
) => {
	const didMount = useRef(false);

	useEffect(() => {
		if (didMount.current) {
			fn();
			return;
		}
		didMount.current = true;

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, fn, didMount]);
};

/**
 * Semantic wrapper around {@link useEffect} used to call a function when one of the dependency changes
 * regardless of whether that dependency is used in the function or not
 */
const watch = <Fn extends (...args: any[]) => any>(
	inputs: DependencyList,
	fn: Fn
	// eslint-disable-next-line react-hooks/rules-of-hooks
) => useEffect(fn, inputs);

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
	const [globalStoreHolder, useGlobalStore] =
		createGlobalStore<ReactGdprGuardGlobalStore>((get, set) => ({
			materializedState: dummyManager.raw(),
			update: (manager: GdprManagerRaw) => {
				return set(store => ({ ...store, materializedState: manager }));
			},
		}));

	const managerWrapper = new ManagerWrapper(dummyManager, globalStoreHolder);

	const saviorWrapper = new SaviorWrapper(savior, managerWrapper);

	const useGdprSavior: UseGdprSavior = (): GdprSavior => saviorWrapper;

	const useGdprManager: UseGdprManager = (): ManagerWrapper => managerWrapper;

	/**
	 * For internal uses only
	 */
	const useWrappedManager = () => useGdprManager().manager;

	const useSetupGdprEffect: UseSetupGdprEffect = (
		onError = (e: unknown) => {}
	) => {
		const wrappingManager = useGdprManager();
		const wrappedManager = useWrappedManager();

		const restoreManagerOnBoot = useFunction(() => {
			(async () => {
				try {
					const manager = await saviorWrapper.restoreOrCreate(
						managerFactory
					);

					wrappingManager.hotswap(manager);
				} catch (e) {
					onError(e);
				}
			})();
		}, [wrappingManager]);

		useEffectOnSecondRender(restoreManagerOnBoot);

		// Auto-close
		watch([wrappedManager], () => {
			if (wrappingManager.bannerWasShown) {
				wrappingManager.closeBanner();
			}
		});
	};

	const useGdprComputed: UseGdprComputed = <T>(
		factory: () => T,
		deps: DependencyList = []
	): T => {
		const globalStore = useGlobalStore();
		const fn = useFunction(factory, deps);

		return useMemo(fn, [globalStore, fn]);
	};

	const useAttachGdprListenersEffect: UseAttachGdprListenersEffect = (
		callback: (eventHub: GdprManagerEventHub, manager: GdprManager) => void
	) => {
		const wrappedManager = useWrappedManager();

		watch([callback, wrappedManager], () => {
			const { events } = wrappedManager;
			callback(events, wrappedManager);
		});
	};

	const useGdprGuardEnabledState: UseGdprGuardEnabledState = (
		guardName: string,
		useBannerStatus: boolean = false
	) => {
		return useGdprComputed(() => {
			const bannerWasShown =
				!useBannerStatus || managerWrapper.bannerWasShown;

			return (
				bannerWasShown &&
				(managerWrapper.getGuard(guardName)?.enabled ?? false)
			);
		}, [guardName, managerWrapper.bannerWasShown]);
	};

	const useGdprGuard: UseGdprGuard = (guardName: string) => {
		const manager = useGdprManager();

		const guard = useGdprComputed(() => {
			return manager.getGuard(guardName)?.raw();
		}, [guardName, manager]) as GdprGuardRaw | null;

		const enableGuard = useFunction(() => {
			manager.enable(guardName);
		}, [guardName, manager]);

		const disableGuard = useFunction(() => {
			manager.disable(guardName);
		}, [guardName, manager]);

		const toggleGuard = useFunction(() => {
			manager.toggle(guardName);
		}, [guardName, manager]);

		return {
			guard,
			enableGuard,
			disableGuard,
			toggleGuard,
		};
	};

	const useGdpr: UseGdpr = () => {
		const wrapper = useGdprManager();

		// Manager
		const manager = useGdprComputed(
			() => wrapper.materializedState,
			[wrapper, wrapper.materializedState]
		);

		const enableManager = useFunction(() => {
			wrapper.enable();
		}, [wrapper]);

		const disableManager = useFunction(() => {
			wrapper.disable();
		}, [wrapper]);

		const toggleManager = useFunction(() => {
			wrapper.toggle();
		}, [wrapper]);

		// Guard/group
		const enableGuard = useFunction(
			(guardName: string) => {
				wrapper.enable(guardName);
			},
			[wrapper]
		);

		const disableGuard = useFunction(
			(guardName: string) => {
				wrapper.disable(guardName);
			},
			[wrapper]
		);

		const toggleGuard = useFunction(
			(guardName: string) => {
				wrapper.toggle(guardName);
			},
			[wrapper]
		);

		const guardIsEnabled = useFunction(
			(guardName: string, useBannerStatus: boolean = false) => {
				const bannerWasShown =
					!useBannerStatus || wrapper.bannerWasShown;
				return bannerWasShown && wrapper.isEnabled(guardName);
			},
			[wrapper]
		);

		// Storage
		const enableForStorage = useFunction(
			(storage: GdprStorage) => {
				wrapper.enableForStorage(storage);
			},
			[wrapper]
		);

		const disableForStorage = useFunction(
			(storage: GdprStorage) => {
				wrapper.disableForStorage(storage);
			},
			[wrapper]
		);

		const toggleForStorage = useFunction(
			(storage: GdprStorage) => {
				wrapper.toggleForStorage(storage);
			},
			[wrapper]
		);

		const closeGdprBanner = useFunction(
			() => wrapper.closeBanner(),
			[wrapper]
		);
		const resetAndShowBanner = useFunction(
			() => wrapper.resetAndShowBanner(),
			[wrapper]
		);
		const bannerWasShown = useGdprComputed(
			() => wrapper.bannerWasShown,
			[wrapper]
		);

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
