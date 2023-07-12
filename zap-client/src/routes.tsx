import React from 'react';
import {RouteObject} from 'react-router/dist/lib/context';
import {AdminPage} from './admin/AdminPage.tsx';
import {PlayerPage} from './player/PlayerPage.tsx';
import {ProjectorPage} from './projector/ProjectorPage.tsx';

export const routes: RouteObject[] = [
	{
		path: '/',
		element: <MissingRoute/>,
	},
	{
		path: '/admin',
		element: <AdminPage/>,
	},
	{
		path: '/player',
		element: <PlayerPage/>,
	},
	{
		path: '/projector',
		element: <ProjectorPage/>,
	},
];

export function MissingRoute() {
	return (
		<div>missing route</div>
	);
}