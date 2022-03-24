import Vue from "vue";
import VueRouter from "vue-router";
// import isWalletConnect from "./guard/isWalletConnect";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/stand",
    name: "Stand",
    meta: {
      needConnection: true,
    },
    component: () => import("../views/Stand.vue"),
  },
  // {
  //   path: "/farm-stand",
  //   name: "FarmStand",
  //   meta: {
  //     needConnection: true,
  //   },
  //   component: () => import("../views/FarmStand.vue"),
  // },
  // {
  //   path: "/mim-3-pool",
  //   name: "Mim3Pool",
  //   meta: {
  //     needConnection: true,
  //   },
  //   component: () => import("../views/Mim3Pool.vue"),
  // },
  {
    path: "/pool/:id",
    name: "Pool",
    meta: {
      needConnection: true,
    },
    component: () => import("../views/Pool.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    meta: {
      needConnection: true,
    },
    component: () => import("../views/Dashboard.vue"),
  },
  // {
  //   path: "/transactions",
  //   name: "Transactions",
  //   meta: {
  //     needConnection: true,
  //   },
  //   component: () => import("../views/Transactions.vue"),
  // },
  // {
  //   path: "/docs",
  //   name: "Docs",
  //   component: () => import("../views/Docs.vue"),
  // },
  // {
  //   path: "/tech",
  //   name: "Tech",
  //   component: () => import("../views/Tech.vue"),
  // },
  {
    path: "/liquidations",
    name: "Liquidations",
    component: () => import("../views/Liquidations.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

// router.beforeEach(isWalletConnect);

export default router;
