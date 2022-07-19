import type { GdprSavior, GdprManagerFactory, GdprGuardHooks } from "./typings";
/**
 * Create hooks for the gdpr-guard library based on the provided {@link GdprSavior}
 * @param savior - The {@link GdprSavior} to wrap
 * @param managerFactory - A factory to the latest version of your {@link GdprManager}
 * @returns The React hooks associated to that {@link GdprSavior}
 */
export declare const createGdprGuardHooks: (savior: GdprSavior, managerFactory: GdprManagerFactory) => GdprGuardHooks;
