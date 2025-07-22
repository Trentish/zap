import {ZapClient} from './ZapClient.ts';
import {createContext, useContext} from 'react';

export const _Client = new ZapClient();
export const ClientContext = createContext(_Client);
export const useClient = (): ZapClient => useContext(ClientContext);