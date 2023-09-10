import { Stack, router, useRootNavigationState } from "expo-router";
import { useSession } from "../../hooks/useSession";
import { useEffect } from "react";


export default function RouteLayout() {
  const { authenticated } = useSession();
  const rootNativationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNativationState?.key) return;
    if (!authenticated) {
      router.replace("/auth/login");
    }
  }, [authenticated, rootNativationState?.key]);
  
  return (
    <Stack />
  );
}