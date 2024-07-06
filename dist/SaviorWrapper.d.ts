import { GdprSavior, GdprManager, GdprManagerFactory, GdprManagerRaw, GdprSaviorAdapter } from "gdpr-guard";
import { ManagerWrapper } from "./ManagerWrapper";
export declare class SaviorWrapper extends GdprSaviorAdapter {
    protected savior: GdprSavior;
    protected managerWrapper: ManagerWrapper;
    constructor(savior: GdprSavior, managerWrapper: ManagerWrapper);
    updateSharedManager(manager: GdprManager): Promise<void>;
    check(): Promise<void>;
    exists(shouldUpdate?: boolean): Promise<boolean>;
    restore(shouldUpdate?: boolean): Promise<GdprManager | null>;
    restoreOrCreate(factory: GdprManagerFactory): Promise<GdprManager>;
    store(manager: GdprManagerRaw): Promise<boolean>;
    decorate(manager: GdprManager): GdprManager;
}
