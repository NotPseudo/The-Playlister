import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider }  from './store'
import {
    AppBanner,
    HomeScreen,
    LoginScreen,
    CreateAccountScreen,
    EditAccountScreen,
    PlaylistsScreen,
    SongsScreen
} from './components'
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
*/
const App = () => {   
    return (
        // <BrowserRouter>
        //     <AuthContextProvider>
        //         <GlobalStoreContextProvider>              
        //             <AppBanner />
        //             <Switch>
        //                 <Route path="/" exact component={HomeWrapper} />
        //                 <Route path="/login/" exact component={LoginScreen} />
        //                 <Route path="/register/" exact component={RegisterScreen} />
        //                 <Route path="/playlist/:id" exact component={WorkspaceScreen} />
        //             </Switch>
        //             <Statusbar />
        //         </GlobalStoreContextProvider>
        //     </AuthContextProvider>
        // </BrowserRouter>
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>              
                    <AppBanner />
                    <Routes>
                        <Route path="/" element={<HomeScreen/>} />
                        <Route path="/login" element={<LoginScreen/>} />
                        <Route path="/register" element={<CreateAccountScreen/>} />
                        <Route path="/edit" element={<EditAccountScreen/>} />
                        <Route path="/playlists" element={<PlaylistsScreen/>} />
                        <Route path="/songs" element={<SongsScreen/>} />
                    </Routes>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App