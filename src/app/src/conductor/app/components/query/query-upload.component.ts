import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';

@Component({
    selector: 'query-upload',
    templateUrl: 'query-upload.component.html'
})
export class QueryUploadComponent {
    @ViewChild('uploader') uploader: ElementRef<HTMLInputElement>;

    @Input() label: string = 'Upload Query';
    @Input() options: string = 'color-default';

    @Output() parsed = new EventEmitter<string>();

    private readUpload = (file: File): Promise<string> => new Promise((resolve, reject) => {
        if (!file)
            reject('No file provided');

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = reader.result.toString();
            resolve(text);
        }

        reader.readAsText(file);
    });

    fileChange = async (event: Event) => {
        const files = (<HTMLInputElement>event.target).files;

        if (files?.length > 0) {
            const text = await this.readUpload(files.item(0));
            if (text) {
                this.parsed.emit(text);
                this.uploader.nativeElement.value = '';
            }
        }
    }
}