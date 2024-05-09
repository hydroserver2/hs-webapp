import { RouteRecordRaw } from 'vue-router'

const disableAccountCreation =
  import.meta.env.VITE_APP_DISABLE_ACCOUNT_CREATION || 'false'

export const routes: RouteRecordRaw[] = [
  {
    path: '/browse',
    name: 'Browse',
    component: () => import('@/pages/Browse.vue'),
    meta: {
      hideFooter: true,
      isFullScreen: true,
      title: 'Browse Monitoring Sites',
      metaTags: [
        {
          name: 'keywords',
          content: 'HydroServer, Site Types, Map, Sites, Data',
        },
      ],
    },
  },
  {
    path: '/sites',
    name: 'Sites',
    component: () => import('@/pages/Sites.vue'),
    meta: {
      hasAuthGuard: true,
      title: 'My Sites',
      metaTags: [
        {
          name: 'keywords',
          content: 'HydroServer, My Sites',
        },
      ],
    },
  },
  {
    path: '/sites/:id',
    name: 'SiteDetails',
    component: () => import('@/pages/SiteDetails.vue'),
    meta: {
      title: 'Site',
      metaTags: [
        {
          name: 'keywords',
          content: 'HydroServer, Site',
        },
      ],
    },
  },
  {
    path: '/sites/:id/datastreams/form/:datastreamId?',
    name: 'DatastreamForm',
    component: () => import('@/pages/DatastreamForm.vue'),
    meta: { hasThingOwnershipGuard: true },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/pages/Contact.vue'),
    meta: {
      title: 'Contact Us',
      metaTags: [
        {
          name: 'keywords',
          content: 'HydroServer, Contact Us, GitHub, Email',
        },
      ],
    },
  },
  {
    path: '/data-sources',
    name: 'DataSources',
    component: () => import('@/pages/DataSourceDashboard.vue'),
    meta: { hasAuthGuard: true },
  },
  {
    path: '/data-sources/:id',
    name: 'DataSource',
    component: () => import('@/pages/DataSourceDetail.vue'),
  },
  {
    path: '/data-loaders',
    name: 'DataLoaders',
    component: () => import('@/pages/DataLoaderDashboard.vue'),
    meta: { hasAuthGuard: true },
  },
  {
    path: '/hydroloader/download',
    name: 'HydroLoader',
    component: () => import('@/pages/HydroLoaderDownload.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@shared/pages/account/Login.vue'),
    meta: {
      title: 'Login',
      hasLoggedOutGuard: true,
      redirectAfterLogin: 'Sites',
      disablePasswordReset: false,
    },
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: () => {
      if (disableAccountCreation === 'true') {
        return import('@shared/pages/PageNotFound.vue')
      } else {
        return import('@/pages/account/Signup.vue')
      }
    },
    meta: {
      hasLoggedOutGuard: true,
      title: 'Sign Up',
      metaTags: [
        {
          name: 'keywords',
          content: 'Sign Up, Account, User',
        },
      ],
    },
  },
  {
    path: '/password_reset',
    name: 'PasswordResetRequest',
    component: () =>
      import('@/pages/account/PasswordRecovery/PasswordResetRequest.vue'),
    meta: {
      title: 'Reset Password',
    },
  },
  {
    path: '/password_reset/:uid/:token',
    name: 'PasswordReset',
    component: () =>
      import('@/pages/account/PasswordRecovery/PasswordReset.vue'),
    meta: {
      title: 'Reset Password',
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/account/Profile.vue'),
    meta: { hasAuthGuard: true, title: 'Profile' },
  },
  {
    path: '/complete-profile',
    name: 'CompleteProfile',
    component: () => import('@/pages/account/CompleteProfile.vue'),
    meta: { hasUnverifiedAuthGuard: true, title: 'Complete Profile' },
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('@/pages/account/VerifyEmail.vue'),
    meta: { hasUnverifiedAuthGuard: true, title: 'Verify Email' },
  },
  {
    path: '/activate',
    name: 'ActivateAccount',
    component: () => import('@/pages/account/ActivateAccount.vue'),
    meta: { hasUnverifiedAuthGuard: true, title: 'Verify Email' },
  },
  {
    path: '/metadata',
    name: 'Metadata',
    component: () => import('@/pages/Metadata.vue'),
    meta: { hasAuthGuard: true },
  },
  {
    path: '/visualize-data/:thingId?',
    name: 'VisualizeData',
    component: () => import('@/pages/VisualizeData.vue'),
    meta: {
      title: 'VisualizeData',
      hideFooter: true,
      isFullScreen: true,
      metaTags: [
        {
          name: 'keywords',
          content: 'HydroServer, Data Visualization',
        },
      ],
    },
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: { title: 'Home' },
  },
]
