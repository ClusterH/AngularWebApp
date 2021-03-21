import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { isEmpty } from 'lodash';

@Component({
    selector: 'route-stops-importer',
    templateUrl: './drag-drop.component.html',
    styleUrls: ['./drag-drop.component.scss']
})
export class StopsFileDragDropComponent {
    @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
    @Input() confirm: any;
    @Output() csvfileDataEmitter = new EventEmitter();

    files: any[] = [];
    progress: number;
    public records: any[] = [];

    /**
     * on file drop handler
     */
    onFileDropped($event) {
        this.prepareFilesList($event);
    }

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

        if (this.isValidCSVFile(files[0])) {
            let reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = () => {
                const csvData = reader.result;
                const csvRecordsArray = (<string>csvData).split("\n");
                const headersRow = this.getHeaderArray(csvRecordsArray);
                this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
                this.csvfileDataEmitter.emit(this.records);
            };

            reader.onerror = function () {
            };
        } else {
            alert("Please import valid .csv file.");
            this.fileReset();
        }
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

    fileBrowseHandler($event: any): void {
        this.prepareFilesList($event.srcElement.files);
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        let csvArr = [];
        for (let i = 1; i < csvRecordsArray.length; i++) {
            if (csvRecordsArray[i] !== "") {
                let currentRecord = (<string>csvRecordsArray[i]).split(',');
                csvArr.push({ location: new TripPath(Number(currentRecord[0]), Number(currentRecord[1].trim())), stopover: false })
            }
        }

        return csvArr;
    }

    isValidCSVFile(file: any) {
        return file.name.endsWith(".csv");
    }

    getHeaderArray(csvRecordsArr: any) {
        const headers = (csvRecordsArr[0]).split(",");
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    fileReset() {
        this.fileDropEl.nativeElement.value = "";
        this.records = [];
    }

}

export class TripPath {
    lat: number;
    lng: number;

    constructor(latitude: number, longitude: number) {
        this.lat = latitude;
        this.lng = longitude;
    }
}
