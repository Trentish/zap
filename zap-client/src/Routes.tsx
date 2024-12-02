import React from 'react';
import {AdminPage} from './admin/AdminPage.tsx';
import {PlayerPage} from './player/PlayerPage.tsx';
import {ProjectorPage} from './projector/ProjectorPage.tsx';
import {useAtom} from 'jotai';
import {E_ConnStatus, E_Endpoint, T_GameIdf} from '../../zap-shared/SystemTypes.ts';
import {$allGameIdfs, $connError, $connStatus, $endpoint, $gameIdf} from './ClientState.ts';
import {HistoryPage} from './projector/HistoryPage.tsx';


export function Routing() {
	const [endpoint] = useAtom($endpoint);
	const [gameIdf] = useAtom($gameIdf);
	const [connStatus] = useAtom($connStatus);
	
	if (connStatus !== E_ConnStatus.connected) return <NotConnected/>;
	
	const badRoute = endpoint === E_Endpoint.unknown || !gameIdf;
	if (badRoute) return <BadRoute/>; //>> bad route
	
	const route = ROUTES[E_Endpoint[endpoint]];
	
	return <route.page/>;
}

export type T_Route = {
	page: () => React.ReactElement,
}

// using string as key
const ROUTES: Record<string, T_Route> = {
	[E_Endpoint[E_Endpoint.admin]]: {
		page: AdminPage,
	},
	[E_Endpoint[E_Endpoint.player]]: {
		page: PlayerPage,
	},
	[E_Endpoint[E_Endpoint.projector]]: {
		page: ProjectorPage,
	},
	[E_Endpoint[E_Endpoint.history]]: {
		page: HistoryPage,
	},
};

function NotConnected() {
	const [connError] = useAtom($connError);
	const [connStatus] = useAtom($connStatus);
	
	return (
		<div style={{
			fontSize: 28,
			// color: '#fff',
		}}>{E_ConnStatus[connStatus]} {connError}</div>
	);
}

function BadRoute() {
	const [endpoint] = useAtom($endpoint);
	const [gameIdf] = useAtom($gameIdf);
	const [allGameIdfs] = useAtom($allGameIdfs);
	
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
				<button onClick={() => doNav(E_Endpoint.history, gameIdf)}>history</button>
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