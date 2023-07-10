import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {routes} from './routes.tsx';
import {ClientProvider} from './Providers.tsx';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
	.render(
		<React.StrictMode>
			<ClientProvider>
				<RouterProvider router={router}/>
			</ClientProvider>
		</React.StrictMode>,
	);
