import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { isEmpty } from 'lodash';

@Component({
    selector: 'app-drag-drop',
    templateUrl: './drag-drop.component.html',
    styleUrls: ['./drag-drop.component.scss']
})
export class MonitorFileDragDropComponent {
    @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
    @Input() confirm: any;
    files: any[] = [];
    progress: number;

    /**
     * on file drop handler
     */
    onFileDropped($event) {

        this.prepareFilesList($event);
    }

    /**
     * handle file from browsing
     */
    fileBrowseHandler(files) {
        this.prepareFilesList(files);
    }

    /**
     * Delete file from files list
     * @param index (File index)
     */
    deleteFile(index: number, isAll?: boolean, isConfirm?: boolean) {

        if (isAll) {
            if (isConfirm) {
                if (isEmpty(this.files)) {
                    alert('Please upload file first!');
                    return;
                }


                this.files = []
            } else {
                this.files = [];
            }
        } else {
            if (this.files[index].progress < 100) {

                return;
            }

            this.files.splice(index, 1);
        }
    }

    prepareFilesList(files: Array<any>) {
        this.files = [];
        for (const item of files) {
            this.files.push(item);
        }
        this.fileDropEl.nativeElement.value = "";
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) {
            return "0 Bytes";
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

}
