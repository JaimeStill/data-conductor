import {
    IStorage,
    LocalStorage,
    Editor
} from '../../models';

import {
    firstValueFrom,
    BehaviorSubject,
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
    private editors = new BehaviorSubject<Editor[]>(null);

    editors$ = this.editors.asObservable();
    
    constructor(
        protected http: HttpClient,
        protected generator: QueryGeneratorService
    ) {
        super('editor', generator, http);
        this.store = new LocalStorage(`conductor-editor-config`);
    }

    getAll$ = this.http.get<Editor[]>(`${this.api}getAll`);

    getAll = () => 
        this.getAll$
            .subscribe({
                next: (data: Editor[]) => this.editors.next(data),
                error: (err: any) => {
                    throw new Error(err);
                }
            })

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