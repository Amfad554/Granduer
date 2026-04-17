// src/hooks/useActivityTimeout.js
import { useEffect, useRef, useCallback } from "react";

const TIMEOUT_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms
const INACTIVITY_DURATION = 30 * 60 * 1000;    // 30 mins inactivity

const useActivityTimeout = (isAuthentified, logout) => {
    const activityTimer = useRef(null);
    const sessionTimer = useRef(null);

    const resetActivityTimer = useCallback(() => {
        if (!isAuthentified) return;

        clearTimeout(activityTimer.current);
        activityTimer.current = setTimeout(() => {
            logout("inactivity");
        }, INACTIVITY_DURATION);

        // Save last active time
        localStorage.setItem("lastActive", Date.now().toString());
    }, [isAuthentified, logout]);

    useEffect(() => {
        if (!isAuthentified) return;

        // ── Check if session already expired (e.g. returning to tab) ──
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

        // ── Start 24-hour session timer ──
        const remaining = loginTime
            ? TIMEOUT_DURATION - (now - parseInt(loginTime))
            : TIMEOUT_DURATION;

        sessionTimer.current = setTimeout(() => {
            logout("session");
        }, remaining);

        // ── Track user activity ──
        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
        events.forEach((e) => window.addEventListener(e, resetActivityTimer));
        resetActivityTimer(); // start immediately

        // ── Handle tab visibility (returning after long absence) ──
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                const storedLogin = localStorage.getItem("loginTime");
                const storedActive = localStorage.getItem("lastActive");
                const now = Date.now();

                if (storedLogin && now - parseInt(storedLogin) > TIMEOUT_DURATION) {
                    logout("session");
                    return;
                }
                if (storedActive && now - parseInt(storedActive) > INACTIVITY_DURATION) {
                    logout("inactivity");
                    return;
                }
                resetActivityTimer();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearTimeout(activityTimer.current);
            clearTimeout(sessionTimer.current);
            events.forEach((e) => window.removeEventListener(e, resetActivityTimer));
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isAuthentified, logout, resetActivityTimer]);
};

export default useActivityTimeout;