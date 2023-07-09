import React, {createContext, useContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {routes} from './routes.tsx';
import {ZapClient} from './ZapClient.ts';

const router = createBrowserRouter(routes);

const _Client = new ZapClient();
const ClientContext = createContext(_Client);
export const useClient = (): ZapClient => useContext(ClientContext);

function ClientProvider({children}: any) {
	return (
		<ClientContext.Provider value={_Client}>
			{children}
		</ClientContext.Provider>
	);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ClientProvider>
			<RouterProvider router={router}/>
		</ClientProvider>
	</React.StrictMode>,
);
