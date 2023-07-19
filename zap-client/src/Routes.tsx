import React from 'react';
import {AdminPage} from './admin/AdminPage.tsx';
import {PlayerPage} from './player/PlayerPage.tsx';
import {ProjectorPage} from './projector/ProjectorPage.tsx';
import {useAtom} from 'jotai';
import {allGameIdfsAtom, endpointAtom, gameIdfAtom} from './ZapClient.ts';
import {E_Endpoint, T_GameIdf} from '../../zap-shared/SystemTypes.ts';


export function Routing() {
	const [endpoint] = useAtom(endpointAtom);
	const [gameIdf] = useAtom(gameIdfAtom);
	
	const badRoute = endpoint === E_Endpoint.unknown || !gameIdf;
	if (badRoute) return <BadRoute/>; //>> bad route
	
	const route = ROUTES[E_Endpoint[endpoint]];
	
	return <route.page/>;
}

// export type T_Route = {
// 	page: () => JSX.Element,
// }

// using string as key
const ROUTES: {
	[p: string]: { page: () => JSX.Element }
} = {
	[E_Endpoint[E_Endpoint.admin]]: {
		page: AdminPage,
	},
	[E_Endpoint[E_Endpoint.player]]: {
		page: PlayerPage,
	},
	[E_Endpoint[E_Endpoint.projector]]: {
		page: ProjectorPage,
	},
}


function BadRoute() {
	const [endpoint] = useAtom(endpointAtom);
	const [gameIdf] = useAtom(gameIdfAtom);
	const [allGameIdfs] = useAtom(allGameIdfsAtom);
	
	//## force reloading the page (for now)
	const doNav = (ep: E_Endpoint, idf: T_GameIdf) => {
		window.location.href = `/${E_Endpoint[ep]}/${idf}`;
		// const [loc, setLoc] = useAtom(locationAtom);
		// setLoc(prev => ({...prev, pathname: `/${E_Endpoint[ep]}/${idf}`} ));
	};
	
	if (endpoint === E_Endpoint.unknown) {
		return (
			<div>
				<h3>{`invalid path, required: /{endpoint}/{gameIdf}`}</h3>
				<p>TODO: delete this page (or at least remove the Admin button)</p>
				
				<button onClick={() => doNav(E_Endpoint.admin, gameIdf)}>admin</button>
				<button onClick={() => doNav(E_Endpoint.player, gameIdf)}>player</button>
				<button onClick={() => doNav(E_Endpoint.projector, gameIdf)}>projector</button>
			</div>
		);
	}
	
	
	if (!gameIdf) {
		return (
			<div>
				<h3>join game:</h3>
				
				{allGameIdfs.map(idf => (
					<button
						key={idf}
						onClick={() => doNav(endpoint, idf)}
					>{idf}</button>
				))}
			</div>
		);
	}
}