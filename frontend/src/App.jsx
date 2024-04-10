import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [title, setTitle] = useState("Initial Title")

  useEffect(()=>{
    (async () => {
      const response = await fetch('/api/hello',
      {
        headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }})
        const jsonRes = await response.json()
        setTitle(jsonRes.message)
      })()
  },[])

  return (
    <>
      <div id="title">
        {title}
      </div>
    </>
  )
}

export default App
