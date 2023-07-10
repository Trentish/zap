import React from 'react';
import {_Client, ClientContext} from './ClientContext.ts';


export function ClientProvider({children}: { children: React.ReactNode }) {
	return (
		<ClientContext.Provider value={_Client}>
			{children}
		</ClientContext.Provider>
	);
}