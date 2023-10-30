import type {
	GdprManagerFactory,
	GdprManagerRaw,
	GdprSavior,
	GdprGuardRaw,
	GdprStorage,
} from "gdpr-guard";
import { GdprManager } from "gdpr-guard";
import {
	DependencyList,
	useRef,
	useCallback,
	useMemo,
	useEffect,
	useDebugValue, useState,
} from "react";

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
import { glob } from "typedoc/dist/lib/utils/fs";

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
	}, [...deps, fn]);
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
	const [globalStoreHolder, useGlobalStore] =
		createGlobalStore<ReactGdprGuardGlobalStore>((get, set) => ({
			materializedState: dummyManager.raw(),
			update: (manager: GdprManagerRaw) => {
				return set(store => ({ ...store, materializedState: manager }));
			},
		}));

	const [, useUnderlyingManager] = createGlobalStore(() => dummyManager);

	const managerWrapper = new ManagerWrapper(dummyManager, globalStoreHolder);

	const saviorWrapper = new SaviorWrapper(savior, managerWrapper);

	const useGdprSavior: UseGdprSavior = (): GdprSavior => saviorWrapper;

	const useGdprManager: UseGdprManager = (): ManagerWrapper => managerWrapper;

	/**
	 * For internal uses only
	 */
	const useWrappedManager = () => {
		const [store] = useGlobalStore();
		return useMemo(() => store.materializedState, [store]);
	};

	const useSetupGdprEffect: UseSetupGdprEffect = onError => {
		const wrappingManager = useGdprManager();
		const [underlyingManager, setUnderlyingManager] = useUnderlyingManager();
		const lastAutoClose = useRef<GdprManager|undefined>();

		const restoreManagerOnBoot = useCallback(() => {
			(async () => {
				try {
					const manager = await saviorWrapper.restoreOrCreate(
						managerFactory
					);

					wrappingManager.hotswap(manager);
					setUnderlyingManager(manager);
				} catch (e) {
					onError?.(e);
				}
			})();

			return () => {};
		}, [onError, wrappingManager]);

		useEffectOnSecondRender(restoreManagerOnBoot);

		// Auto-close
		useEffect(() => {
			if (lastAutoClose.current !== underlyingManager && wrappingManager.bannerWasShown) {
				lastAutoClose.current =  wrappingManager.manager;
				wrappingManager.closeBanner();
			}
		}, [underlyingManager, wrappingManager]);
	};

	const useGdprComputed: UseGdprComputed = <T>(
		factory: () => T,
		deps: DependencyList = []
	): T => {
		const globalStore = useGlobalStore();

		return useMemo(factory, [...deps, factory, globalStore /*, fn*/]);
	};

	const useAttachGdprListenersEffect: UseAttachGdprListenersEffect =
		callback => {
			const manager = useGdprManager();
			const [underlyingManager] = useUnderlyingManager();

			useEffect(() => {
				return callback(manager.events, underlyingManager || manager.manager);
			}, [callback, manager.events, manager.manager, underlyingManager]);
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

		const enableGuard = useCallback(() => {
			manager.enable(guardName);
		}, [guardName, manager]);

		const disableGuard = useCallback(() => {
			manager.disable(guardName);
		}, [guardName, manager]);

		const toggleGuard = useCallback(() => {
			manager.toggle(guardName);
		}, [guardName, manager]);

		useDebugValue(guardName);

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

		const enableManager = useCallback(() => {
			wrapper.enable();
		}, [wrapper]);

		const disableManager = useCallback(() => {
			wrapper.disable();
		}, [wrapper]);

		const toggleManager = useCallback(() => {
			wrapper.toggle();
		}, [wrapper]);

		// Guard/group
		const enableGuard = useCallback(
			(guardName: string) => {
				wrapper.enable(guardName);
			},
			[wrapper]
		);

		const disableGuard = useCallback(
			(guardName: string) => {
				wrapper.disable(guardName);
			},
			[wrapper]
		);

		const toggleGuard = useCallback(
			(guardName: string) => {
				wrapper.toggle(guardName);
			},
			[wrapper]
		);

		const guardIsEnabled = useCallback(
			(guardName: string, useBannerStatus: boolean = false) => {
				const bannerWasShown =
					!useBannerStatus || wrapper.bannerWasShown;
				return bannerWasShown && wrapper.isEnabled(guardName);
			},
			[wrapper]
		);

		// Storage
		const enableForStorage = useCallback(
			(storage: GdprStorage) => {
				wrapper.enableForStorage(storage);
			},
			[wrapper]
		);

		const disableForStorage = useCallback(
			(storage: GdprStorage) => {
				wrapper.disableForStorage(storage);
			},
			[wrapper]
		);

		const toggleForStorage = useCallback(
			(storage: GdprStorage) => {
				wrapper.toggleForStorage(storage);
			},
			[wrapper]
		);

		const closeGdprBanner = useCallback(
			() => wrapper.closeBanner(),
			[wrapper]
		);
		const resetAndShowBanner = useCallback(
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
