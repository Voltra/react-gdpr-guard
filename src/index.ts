import type { GdprManager } from "gdpr-guard";
import { ManagerWrapper } from "./ManagerWrapper";

type UseGdprManager = () => GdprManager;

export const createGdprGuardHooks = (manager: GdprManager) => {
  const wrapper = new ManagerWrapper(manager);
  const useGdprManager = () => manager;

  return {
    useGdprManager,
  };
};
