import type { GdprManager, GdprManagerRaw, GdprGuard, GdprGuardGroup, GdprStorage, GdprManagerEventHub } from "gdpr-guard";
import type { MethodNamesOf } from "./typings";
import { ArgumentsOf } from "./typings";
import { StoreHolder } from "./globalState";
export interface ReactGdprGuardGlobalStore {
    materializedState: GdprManagerRaw;
    update(manager: GdprManagerRaw): ReactGdprGuardGlobalStore;
}
export declare class ManagerWrapper {
    protected _manager: GdprManager;
    protected _globalStoreHolder: StoreHolder<ReactGdprGuardGlobalStore>;
    constructor(_manager: GdprManager, _globalStoreHolder: StoreHolder<ReactGdprGuardGlobalStore>);
    get manager(): GdprManager;
    get materializedState(): GdprManagerRaw;
    triggerUpdate(): void;
    get bannerWasShown(): boolean;
    get events(): GdprManagerEventHub;
    closeBanner(): void;
    resetAndShowBanner(): void;
    json(): GdprManagerRaw;
    toString(): string;
    disable(target?: string): this;
    enable(target?: string): this;
    toggle(target?: string): this;
    disableForStorage(storageType: GdprStorage): this;
    enableForStorage(storageType: GdprStorage): this;
    toggleForStorage(storageType: GdprStorage): this;
    isEnabled(name: string): boolean;
    hasGroup(groupName: string): boolean;
    hasGuard(guardName: string): boolean;
    getGroup(groupName: string): GdprGuardGroup | null;
    getGuard(guardName: string): GdprGuard | null;
    protected generateRawManager(): GdprManagerRaw;
    hotswap(newManager: GdprManager): this;
    protected wrap<Method extends MethodNamesOf<GdprGuard>>(method: Method, target?: string, ...args: ArgumentsOf<GdprGuard[Method]>): this;
}
