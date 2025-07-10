import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { auth, OpenAPI } from './lib/auth'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger({
        documentation: {
            components: await OpenAPI.components,
            paths: await OpenAPI.getPaths()
        }
    }))
    .use(cors({
        credentials: true,
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }))
    .mount('/auth', auth.handler)
    .macro({
        auth: {
            async resolve({ status, request: { headers } }) {
                const session = await auth.api.getSession({
                    headers
                })

                if (!session) return status(401)

                return {
                    user: session.user,
                    session: session.session
                }
            }
        }
    })
    .get('/', () => 'Hello Elysia!')
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

export type ElysiaApp = typeof app