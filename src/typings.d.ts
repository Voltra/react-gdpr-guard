import type {
	GdprManagerRaw,
	GdprSavior,
	GdprGuardRaw,
	GdprGuard,
	GdprManager,
	GdprStorage,
} from "gdpr-guard";
import type { DependencyList } from "react";
import type { ManagerWrapper } from "./ManagerWrapper";
import type { SaviorWrapper } from "./SaviorWrapper";

export * from "gdpr-guard";

export type UseSetupGdprEffect = () => void;

export type UseGdprComputed = <T>(factory: () => T, deps?: DependencyList) => T;

export type UseGdprSavior = () => GdprSavior;

export type UseGdprManager = () => ManagerWrapper;

export type UseGdprGuardEnabledState = (guardName: string) => boolean;

export interface UseGdprGuardResult {
	/**
	 * The current raw state of the {@link GdprGuard}
	 */
	guard: GdprGuardRaw | null;

	/**
	 * Enable the {@link GdprGuard}
	 */
	enableGuard: () => void;

	/**
	 * Disable the {@link GdprGuard}
	 */
	disableGuard: () => void;

	/**
	 * Toggle the {@link GdprGuard}
	 */
	toggleGuard: () => void;
}

export type UseGdprGuard = (guardName: string) => UseGdprGuardResult;

export interface UseGdprResult {
	/**
	 * The current raw state of the {@link GdprManager}
	 */
	manager: GdprManagerRaw;

	/**
	 * Enable all {@link GdprGuard}s of this {@link GdprManager}
	 */
	enableManager: () => void;

	/**
	 * Disable all {@link GdprGuard}s of this {@link GdprManager}
	 */
	disableManager: () => void;

	/**
	 * Toggle all {@link GdprGuard}s to the enabled state of the {@link GdprManager}
	 */
	toggleManager: () => void;

	/**
	 * Enable the {@link GdprGuard} that has the given guard name
	 */
	enableGuard: (guardName: string) => void;

	/**
	 * Disable the {@link GdprGuard} that has the given guard name
	 */
	disableGuard: (guardName: string) => void;

	/**
	 * Disable the {@link GdprGuard} that has the given guard name
	 */
	toggleGuard: (guardName: string) => void;

	/**
	 * Determine whether or not the {@link GdprGuard} that has the given guard name is currently enabled
	 */
	guardIsEnabled: (guardName: string) => boolean;

	/**
	 * Enable all {@link GdprGuard}s of this {@link GdprManager} that have the given {@link GdprStorage}
	 */
	enableForStorage: (storage: GdprStorage) => void;

	/**
	 * Disable all {@link GdprGuard}s of this {@link GdprManager} that have the given {@link GdprStorage}
	 */
	disableForStorage: (storage: GdprStorage) => void;

	/**
	 * Toggle all {@link GdprGuard}s that have the given {@link GdprStorage} to the enabled state of the {@link GdprManager}
	 */
	toggleForStorage: (storage: GdprStorage) => void;
}

export type UseGdpr = () => UseGdprResult;

export interface GdprGuardHooks {
	/**
	 * Hook to bootstrap the whole GDPR logic
	 */
	useSetupGdprEffect: UseSetupGdprEffect;

	/**
	 * Hook to (re-)compute a value based on changes in the {@link GdprManager}
	 */
	useGdprComputed: UseGdprComputed;

	/**
	 * Hook to have access to the {@link GdprSavior} from anywhere
	 */
	useGdprSavior: UseGdprSavior;

	/**
	 * Hook to have access to the manager (or more accurately the {@link ManagerWrapper}) from anywhere
	 */
	useGdprManager: UseGdprManager;

	/**
	 * Hook to get the enabled state of a given {@link GdprGuard}
	 */
	useGdprGuardEnabledState: UseGdprGuardEnabledState;

	/**
	 * Hook to handle a single {@link GdprGuard}'s state
	 */
	useGdprGuard: UseGdprGuard;

	/**
	 * Hook to handle a whole {@link GdprManager}'s state
	 */
	useGdpr: UseGdpr;
}
