import './App.css'
import PMTable from './Components/PMTable'


function App() {
  return (
    <PMTable
    caption='Horário de Laboratório'
        header={["", "", ""]}
        data={[["", "", ""], ["", "", ""],["", "", ""],["", "", ""]]}
      />
  )
}

export default App
