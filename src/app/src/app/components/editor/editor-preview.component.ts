import {
    AfterContentChecked,
    ElementRef,
    Component,
    Input,
    ViewChild
} from '@angular/core';

import { Editor } from '../../models';

@Component({
    selector: 'editor-preview',
    templateUrl: 'editor-preview.component.html'
})
export class EditorPreviewComponent implements AfterContentChecked {
    @Input() preview: Editor;

    @ViewChild('editor') editor: ElementRef<HTMLTextAreaElement>;

    ngAfterContentChecked(): void {
        if (this.editor && this.preview) {
            this.editor.nativeElement.value = JSON.stringify(this.preview, null, this.preview.tabSpacing);
            this.resize();
        }
    }

    resize = () => {
        this.editor.nativeElement.style.height = '';
        this.editor.nativeElement.style.height = `${this.editor.nativeElement.scrollHeight + this.preview.padding}px`;
    }
}