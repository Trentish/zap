import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Routing} from './Routes.tsx';
import {ClientProvider} from './Providers.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
	.render(
		<React.StrictMode>
			<ClientProvider>
				<Routing/>
			</ClientProvider>
		</React.StrictMode>,
	);