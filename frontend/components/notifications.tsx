import { useEffect, useState } from "react";

const usePushNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = async () => {
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm === "granted") {
      console.log("Push notifications granted.");
    } else {
      console.error("Push notifications denied.");
    }
  };

  return { permission, requestPermission };
};

export default usePushNotifications;
