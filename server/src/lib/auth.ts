import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { openAPI } from 'better-auth/plugins'

export const auth = betterAuth({
    plugins: [openAPI()],
    basePath: '/api',
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),

    emailAndPassword: {
        enabled: true
    },

    socialProviders: {
        // z.B. GitHub
        // github: {
        //   clientId: process.env.GITHUB_CLIENT_ID!,
        //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        // }
    },
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

export const OpenAPI = {
    getPaths: (prefix = '/auth/api') =>
        getSchema().then(({ paths }) => {
            const reference: typeof paths = Object.create(null)

            for (const path of Object.keys(paths)) {
                const key = prefix + path
                // @ts-ignore
                reference[key] = paths[path]

                // @ts-ignore
                for (const method of Object.keys(paths[path])) {
                    const operation = (reference[key] as any)[method]

                    operation.tags = ['Better Auth']
                }
            }

            return reference
        }) as Promise<any>,
    components: getSchema().then(({ components }) => components) as Promise<any>
} as const