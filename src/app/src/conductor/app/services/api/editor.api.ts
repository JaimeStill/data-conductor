import {
    IStorage,
    LocalStorage,
    Editor
} from '../../models';

import {
    firstValueFrom,
    Observable
} from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryGeneratorService } from '../core';
import { EntityApi } from './base';

@Injectable({
    providedIn: 'root'
})
export class EditorApi extends EntityApi<Editor> {
    private store: IStorage<Editor>;
    
    constructor(
        protected http: HttpClient,
        protected generator: QueryGeneratorService
    ) {
        super('editor', generator, http);
        this.store = new LocalStorage(`conductor-editor-config`);
    }

    getDefaultEditor$ = (): Observable<Editor> =>
        this.http.get<Editor>(`${this.api}getDefaultEditor`);

    getDefaultEditor = (): Promise<Editor> =>
        firstValueFrom(
            this.getDefaultEditor$()
        );
        
    getStoreEditor = async (): Promise<Editor> => {
        if (!this.store.hasState)
            this.store.set(await this.getDefaultEditor());

        return this.store.get();
    }
        
    updateStoreEditor = (editor: Editor) =>
        this.store.set(editor);
}