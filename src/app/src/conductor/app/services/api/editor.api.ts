import {
    IStorage,
    LocalStorage,
    Editor
} from '../../models';

import {
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
    private editor = new BehaviorSubject<Editor>(null);

    editors$ = this.editors.asObservable();
    editor$ = this.editor.asObservable();

    constructor(
        protected http: HttpClient,
        protected generator: QueryGeneratorService
    ) {
        super('editor', generator, http);
        this.store = new LocalStorage(`conductor-editor-config`);
    }

    override getBase = () => Object.assign(
        <Editor>{
            color: 'inherit',
            font: 'Courier New',
            fontSize: 14,
            padding: 4,
            resize: false,
            tabSpacing: 4
        },
        this.base()
    );

    getAll$ = this.http.get<Editor[]>(`${this.api}getAll`);

    getAll = () =>
        this.getAll$
            .subscribe({
                next: (data: Editor[]) => this.editors.next(data),
                error: (err: any) => {
                    throw new Error(err);
                }
            });

    getDefaultEditor$ = (): Observable<Editor> =>
        this.http.get<Editor>(`${this.api}getDefaultEditor`);

    getDefaultEditor = (): Promise<Editor> => new Promise((resolve, reject) => {
        this.getDefaultEditor$()
            .subscribe({
                next: (data: Editor) => {
                    this.editor.next(data);
                    resolve(data);
                },
                error: (err: any) => reject(err)
            })
    });

    getStoreEditor = (): Promise<Editor> => new Promise(async (resolve, reject) => {
        try {
            if (!this.store.hasState)
                this.store.set(await this.getDefaultEditor());

            this.editor.next(this.store.get());
            resolve(this.editor.value);
        } catch (err: any) {
            reject(err);
        }
    });

    updateStoreEditor = (editor: Editor) => {
        this.store.set(editor);
        this.editor.next(editor);
    }
}