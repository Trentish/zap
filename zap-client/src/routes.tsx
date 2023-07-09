import React from 'react';
import {RouteObject} from 'react-router/dist/lib/context';
import {AdminPage} from './admin/AdminPage.tsx';
import {PlayerPage} from './player/PlayerPage.tsx';
import {ScreenPage} from './screen/ScreenPage.tsx';

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
		path: '/screen',
		element: <ScreenPage/>,
	},
];

export function MissingRoute() {
	return (
		<div>missing route</div>
	);
}