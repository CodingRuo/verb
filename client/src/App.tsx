import { useState } from 'react'
import beaver from './assets/beaver.svg'
import './App.css'
import { treaty } from '@elysiajs/eden'
import type { ElysiaApp } from '@server/index'

const client = treaty<ElysiaApp>('localhost:3000');

function App() {
    const [data, setData] = useState<Awaited<ReturnType<typeof client.get>>['data']>(null); // [!code ++]

    async function sendRequest() {
        // Typsicherer API-Aufruf mit Autovervollständigung
        const { data, error } = await client.get(); // [!code ++]

        if (error) {
            console.error(error);
            return;
        }

        setData(data);
    }

    return (
        <>
            <div>
                <a href="https://github.com/stevedylandev/bhvr" target="_blank">
                    <img src={beaver} className="logo" alt="beaver logo" />
                </a>
            </div>
            <h1>bhvr</h1>
            <h2>Bun + Hono + Vite + React</h2>
            <p>A typesafe fullstack monorepo</p>
            <div className="card">
                <div className='button-container'>
                    <button onClick={sendRequest}>
                        Call API
                    </button>
                    <a className='docs-link' target='_blank' href="https://bhvr.dev">Docs</a>
                </div>
                {data && (
                    <pre className='response'>
                        <code>
                            Message: {data} <br />
                        </code>
                    </pre>
                )}
            </div>
        </>
    )
}

export default App