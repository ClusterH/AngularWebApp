import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { JobList } from '../../model';
import { RoutePlanningStorageService, CSVFileUploaderService } from '../../services';

@Component({
    selector: 'logistic-routeplanning-csvimporter',
    templateUrl: './csvimporter.component.html',
    styleUrls: ['./csvimporter.component.scss']
})
export class CsvimporterComponent implements OnInit {
    public records: any[] = [];
    selectedFile: File = null;
    imageUrl: string;
    fileToUpload: File = null;
    saveFileForm: any;
    lstFileDetails: any;

    @ViewChild('csvReader') csvReader: any;
    // @Output() csvImportEvent = new EventEmitter<any>();

    constructor(
        private routePlanningStorageService: RoutePlanningStorageService,
        private csvFileUploaderService: CSVFileUploaderService
    ) { }

    ngOnInit(): void {
    }

    fileBrowserHandler() {

    }

    uploadListener(event) {

        // this.fileToUpload = event.target.files.item(0);
        // const reader = new FileReader();
        // reader.onload = (event: any) => {
        //     this.imageUrl = event.target.result;
        // }

        // reader.readAsDataURL(this.fileToUpload);
        //
        let formData = new FormData();
        formData.append('FileUpload', event.srcElement.files[0]);

        this.csvFileUploaderService.AddFileDetails(formData).subscribe(result => {

        });

    }

    // uploadListener($event: any): void {
    //

    //     let text = [];
    //     let files = $event.srcElement.files;
    //

    //     if (this.isValidCSVFile(files[0])) {

    //         let input = $event.target;
    //         let reader = new FileReader();
    //         reader.readAsText(input.files[0]);

    //         reader.onload = () => {
    //             let csvData = reader.result;
    //
    //             let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
    //
    //             let headersRow = this.getHeaderArray(csvRecordsArray);
    //
    //             this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
    //             this.routePlanningStorageService.setJobList(this.records);
    //
    //         };

    //         reader.onerror = function () {
    //
    //         };

    //     } else {
    //         alert("Please import valid .csv file.");
    //         this.fileReset();
    //     }
    // }

    // getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    //     let csvArr = [];

    //     for (let i = 1; i < csvRecordsArray.length; i++) {
    //         let curruntRecord = (<string>csvRecordsArray[i]).split(',');
    //
    //         if (curruntRecord.length == headerLength) {
    //             let csvRecord: JobList = new JobList();
    //             csvRecord.id = curruntRecord[0].trim();
    //             csvRecord.scheduledate = curruntRecord[1].trim();
    //             csvRecord.address = curruntRecord[2].trim();
    //             csvRecord.operator = curruntRecord[3].trim();
    //             csvRecord.status = curruntRecord[4].trim();
    //             csvRecord.description = curruntRecord[5].trim();
    //             csvArr.push(csvRecord);
    //         }
    //     }
    //     return csvArr;
    // }

    // isValidCSVFile(file: any) {
    //     return file.name.endsWith(".csv");
    // }

    // getHeaderArray(csvRecordsArr: any) {
    //     let headers = (csvRecordsArr[0]).split(",");
    //     let headerArray = [];
    //     for (let j = 0; j < headers.length; j++) {
    //         headerArray.push(headers[j]);
    //     }
    //     return headerArray;
    // }

    // fileReset() {
    //     this.csvReader.nativeElement.value = "";
    //     this.records = [];
    // }
}

