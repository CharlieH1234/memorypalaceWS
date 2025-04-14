import { SelectInfo } from '../select-info/SelectInfo'
import { MemoryPalaceProvider } from '../../context/MemoryPalaceContext'
import './CreateMemoryPalace.css'

export const CreateMemoryPalace = () => {
  return (
    <div className="create-memory-palace">
      <header className="create-header">
        <h1>Create Memory Palace</h1>
        <div className="steps">
          <div className="step active">1. Select Info</div>
          <div className="step">2. Chunk Info</div>
          <div className="step">3. Create Images</div>
          <div className="step">4. Create Map</div>
          <div className="step">5. Map Images</div>
          <div className="step">6. Test Memory</div>
        </div>
      </header>
      <main className="create-content">
        <MemoryPalaceProvider>
          <SelectInfo />
        </MemoryPalaceProvider>
      </main>
    </div>
  )
}
