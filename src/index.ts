import type { GdprManager } from "gdpr-guard";

type UseGdprManager = () => GdprManager;

export const createGdprGuardHooks = (manager: GdprManager) => {
  const useGdprManager = () => manager;

  return {
    useManager: useGdprManager,
  };
};
