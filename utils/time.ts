import { useTranslation } from "react-i18next";

export const useTranslatedTime = () => {
  const { t } = useTranslation();
  const timeSince = (isoTime: string) => {
    const now = new Date();
    const past = new Date(isoTime);

    // Calculate the difference in milliseconds
    const diffMs = now.valueOf() - past.valueOf();

    // Convert the difference in various units
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    // Determine and format the difference
    if (diffWeeks > 0) {
      const unit = `week${diffWeeks > 1 ? "s" : ""}`;
      return `${diffWeeks} ${t(unit, { ns: "time" })} ${t("ago", {
        ns: "time",
      })}`;
    } else if (diffDays > 0) {
      const unit = `day${diffDays > 1 ? "s" : ""}`;
      return `${diffDays} ${t(unit, { ns: "time" })} ${t("ago", {
        ns: "time",
      })}`;
    } else if (diffHours > 0) {
      const unit = `hour${diffHours > 1 ? "s" : ""}`;
      return `${diffHours} ${t(unit, { ns: "time" })} ${t("ago", {
        ns: "time",
      })}`;
    } else if (diffMins > 0) {
      const unit = `min${diffMins > 1 ? "s" : ""}`;
      return `${diffMins} ${t(unit, { ns: "time" })} ${t("ago", {
        ns: "time",
      })}`;
    } else {
      const unit = `sec${diffSecs > 1 ? "s" : ""}`;
      return `${diffSecs} ${t(unit, { ns: "time" })} ${t("ago", {
        ns: "time",
      })}`;
    }
  };
  return timeSince;
};
