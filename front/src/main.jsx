import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import User from './User.jsx'
import Store from "./Store.jsx"
import Canvas from './Canvas.jsx'
import Notfound from './Notfound.jsx'


import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router=createBrowserRouter([
  {
    path:"/",element:<App/>
  },
   {
    path:"/User",element:<User/>
  },
   {
    path:"/Store",element:<Store/>
  },
   {
    path:"/Canvas",element:<Canvas/>
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
