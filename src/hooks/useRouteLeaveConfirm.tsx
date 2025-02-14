import { useRouter } from "next/router";
import { useEffect } from "react";

export const useRouteLeaveConfirm = (shouldConfirm: boolean) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!shouldConfirm) return;
      const answer = window.confirm("有未保存的更新，确定离开吗？");
      if (!answer) {
        // 触发 routeChangeError 事件，并抛出异常阻断路由变化
        router.events.emit("routeChangeError");
        // 抛出的异常会被 Next.js 捕获，导致路由切换中断
        throw "Abort route change";
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [shouldConfirm, router]);
};
