import React from 'react';
import ReactDOM from 'react-dom/client';
import './reset.css';
import './index.css';
import './fonts.css';
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
