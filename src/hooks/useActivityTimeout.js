import { useEffect, useRef, useCallback } from "react";

const TIMEOUT_DURATION = 24 * 60 * 60 * 1000;
const INACTIVITY_DURATION = 30 * 60 * 1000;

const useActivityTimeout = (isAuthentified, logout) => {
    const activityTimer = useRef(null);
    const sessionTimer = useRef(null);

    // ───────── SESSION TIMER ─────────
    const resetSessionTimer = useCallback(() => {
        if (!isAuthentified) return;

        clearTimeout(sessionTimer.current);

        const loginTime = parseInt(localStorage.getItem("loginTime") || "0");
        const now = Date.now();

        const remaining = Math.max(
            TIMEOUT_DURATION - (now - loginTime),
            0
        );

        sessionTimer.current = setTimeout(() => {
            logout("session");
        }, remaining);
    }, [isAuthentified, logout]);

    // ───────── ACTIVITY TIMER ─────────
    const resetActivityTimer = useCallback(() => {
        if (!isAuthentified) return;

        clearTimeout(activityTimer.current);

        activityTimer.current = setTimeout(() => {
            logout("inactivity");
        }, INACTIVITY_DURATION);

        localStorage.setItem("lastActive", Date.now().toString());
    }, [isAuthentified, logout]);

    useEffect(() => {
        if (!isAuthentified) return;

        const loginTime = localStorage.getItem("loginTime");
        const lastActive = localStorage.getItem("lastActive");
        const now = Date.now();

        if (loginTime && now - parseInt(loginTime) > TIMEOUT_DURATION) {
            logout("session");
            return;
        }

        if (lastActive && now - parseInt(lastActive) > INACTIVITY_DURATION) {
            logout("inactivity");
            return;
        }

        resetSessionTimer();
        resetActivityTimer();

        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

        events.forEach((e) =>
            window.addEventListener(e, resetActivityTimer)
        );

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                resetSessionTimer();
                resetActivityTimer();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearTimeout(activityTimer.current);
            clearTimeout(sessionTimer.current);

            events.forEach((e) =>
                window.removeEventListener(e, resetActivityTimer)
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [isAuthentified, logout, resetActivityTimer, resetSessionTimer]);
};

export default useActivityTimeout;