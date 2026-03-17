import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { InitScreen } from '@/components/init/InitScreen'
import { isInitComplete } from '@/db'

function Root() {
  const [initDone, setInitDone] = useState<boolean | null>(null)

  useEffect(() => {
    isInitComplete().then((done) => setInitDone(done ?? false))
  }, [])

  if (initDone === null) {
    // Loading check
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-3xl font-black">
          <span className="text-white">Juice</span>
          <span className="text-[#bf5fff]">ify</span>
        </div>
      </div>
    )
  }

  if (!initDone) {
    return <InitScreen onComplete={() => setInitDone(true)} />
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
