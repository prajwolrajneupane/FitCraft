import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import User from './User.jsx'
import Store from "./Purchase.jsx"
import Canvas from './Canvas.jsx'
import Notfound from './Notfound.jsx'
import Nav from './Nav.jsx'
import Wearables from './Wearables.jsx'


import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Login/Login.jsx'
import SignUp from './Login/SignUp.jsx'
import Details from '../Details.jsx'


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
    path:"/login",element:
    <Login/>
    
  },
    {
    path:"/SignUp",element:
    <SignUp/>
    
  },
  {
    path:"/details",element:
    <Details/>
    
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
