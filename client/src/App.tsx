import { useState } from 'react'
import verb from '@client/assets/verb.svg'
import './App.css'
import { ApiResponse } from 'shared'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"

function App() {
    const [data, setData] = useState<ApiResponse | undefined>()

    async function sendRequest() {
        try {
            const req = await fetch(`${SERVER_URL}/`)
            const res: ApiResponse = await req.json()
            setData(res)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <a href="https://github.com/CodingRuo/verb" target="_blank">
                <img src={verb} className="logo" alt="verb logo" />
            </a>
            <h1>verb</h1>
            <h2>Vite + Elysia + React + bun</h2>
            <p>A typesafe fullstack monorepo</p>
            <div className="card">
                <div className='button-container'>
                    <button onClick={sendRequest}>
                        Call API
                    </button>
                </div>
                {data && (
                    <pre className='response'>
                        <code>
                            Message: {data.message} <br />
                        </code>
                    </pre>
                )}
            </div>
        </>
    )
}

export default App