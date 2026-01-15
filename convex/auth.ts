import {  createClient } from '@convex-dev/better-auth'
import { convex, crossDomain } from '@convex-dev/better-auth/plugins'
import {  betterAuth } from 'better-auth/minimal'
import { organization, phoneNumber } from 'better-auth/plugins'
import { components, internal } from './_generated/api'
import { query } from './_generated/server'
import authConfig from './auth.config'
import { env } from './env'
import authSchema from './betterAuth/schema'
import type { DataModel } from './_generated/dataModel'
import type {BetterAuthOptions} from 'better-auth/minimal';
import type {GenericCtx} from '@convex-dev/better-auth';

const siteUrl = env.SITE_URL

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
  },
)

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    trustedOrigins: [siteUrl],
    secret: env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),

    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },

    plugins: [
      // The cross domain plugin is required for client side frameworks
      crossDomain({ siteUrl }),
      // The Convex plugin is required for Convex compatibility
      convex({ authConfig }),

      organization({
        organizationHooks: {
          afterCreateOrganization: async ({ organization: org, member, user }) => {
            console.log("afterCreateOrganization")
            console.log(org, member, user)
            // Create churchMember record for the org creator
            // We use runMutation because hooks run in action context without direct db access
            if ('runMutation' in ctx) {
              console.log("runMutation")
              // Better Auth types these as plain strings, but they are valid Convex IDs
              // created by the Convex adapter - the type assertion is safe here
              await ctx.runMutation(internal.churches.createChurchMemberInternal, {
                organizationId: org.id,
                organizationMemberId: member.id,
                name: user.name,
              })
            }else{
              console.log("runMutation not found in ctx")
            }
          },
        },
      }),

      phoneNumber({
        sendOTP(data, _ctx) {
          // TODO: Implement your OTP sending logic here.
          // For example, integrate with Twilio or another SMS service.
          console.log(
            `Sending OTP ${data.code} to phone number ${data.phoneNumber}`,
          )
        },
      }),
    ],
  } satisfies BetterAuthOptions
}

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx))
}

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx)
  },
})
