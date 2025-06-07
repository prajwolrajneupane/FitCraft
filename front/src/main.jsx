import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import User from './User.jsx'
import Store from "./Purchase.jsx"
import Canvas from './Canvas.jsx'
import Notfound from './Notfound.jsx'
import Nav from './Nav.jsx'
import Wearables from './wearables.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router=createBrowserRouter([
  {
    path:"/",element:<App/>
  },
   {
    path:"/User",element:<User/>
  },
   {
    path:"/Store/:id",element:<>
   
    <Store/>
    </>
  },
   {
    path:"/Canvas/:name",element:
    <Canvas/>
    
  },
  {
    path:"/Canvas",element:
    <Canvas/>
    
  },
   {
    path:"/Wearables",element:
    <Wearables/>
    
  },
   {
    path:"/*",element:<Notfound/>
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router}/>  
  </StrictMode>,
)
