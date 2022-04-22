import store from "@/store";

export default function (to, from, next) {
  console.log("GUARD HERE");

  if (to.matched.some((record) => record.meta.needConnection)) {
    if (!store.getters.getWalletIsConnected) {
      alert("Connect wallet first");
      next({
        name: "Stand",
      });
    } else {
      next();
    }
  } else {
    next();
  }
}
