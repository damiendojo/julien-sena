import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.documents.use(async (context, next) => {
      const targetUids = ['api::project.project'];
      const targetActions = ['publish', 'unpublish', 'delete'];

      // Execute the database action first so the new state is saved
      const result = await next();

      if (targetUids.includes(context.uid) && targetActions.includes(context.action)) {
        const vercelHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
        if (vercelHookUrl) {
          console.log(`Document action ${context.action} detected on ${context.uid}. Triggering Vercel rebuild...`);
          fetch(vercelHookUrl, { method: 'POST' })
            .then((res) => {
              console.log(`Vercel rebuild triggered successfully. Status: ${res.status}`);
            })
            .catch((err) => {
              console.error('Failed to trigger Vercel rebuild:', err);
            });
        } else {
          console.warn('VERCEL_DEPLOY_HOOK_URL environment variable is not defined.');
        }
      }

      return result;
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
