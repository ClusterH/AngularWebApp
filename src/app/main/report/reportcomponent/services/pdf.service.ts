import { Injectable } from '@angular/core';
import { data } from 'jquery';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { report } from 'process';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PDFService {
    reportName: string;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor() { }

    getDocumentDefinition(table) {
        // sessionStorage.setItem('resume', JSON.stringify(this.resume));
        this.reportName = '';
        // Excel Title, Header, Data
        const report_param = JSON.parse(localStorage.getItem('report_result'));
        let reportName = report_param.reportname.split('_');
        for (let i = 1; i < reportName.length; i++) {
            this.reportName += reportName[i] + ' ';
        }

        const title = this.reportName + ' ' + 'Report';
        let pdfFormatted: any;
        pdfFormatted = {
            pageSize: 'LETTER',
            pageOrientation: 'landscape',
            content: [
                {
                    text: title,
                    bold: true,
                    fontSize: 20,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                {
                    columns: [
                        [{
                            text: 'Run On: ' + report_param.runondate,
                        },
                        {
                            text: 'Company: ' + report_param.companyname,
                        },
                        {
                            text: 'From: ' + report_param.datefrom,
                        },
                        {
                            text: 'To: ' + report_param.dateto,
                        },
                        {
                            text: 'Total: ' + localStorage.getItem('total_length'),
                            margin: [0, 0, 0, 10]
                        }
                        ],
                    ]
                },
                this.getTableObject(table),
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 20, 0, 10],
                    decoration: 'underline'
                },
                tableHeader: {
                    bold: true,
                    fillColor: '#CCCCCC'
                }
            }
        };

        if (report_param.groupname) {
            pdfFormatted.content[1].columns[0].splice(2, 0, { text: 'Group: ' + report_param.groupname });
        }
        if (report_param.groupname && report_param.unitname) {
            pdfFormatted.content[1].columns[0].splice(3, 0, { text: 'Unit: ' + report_param.unitname });
        }
        if (!report_param.groupname && report_param.unitname) {
            pdfFormatted.content[1].columns[0].splice(2, 0, { text: 'Unit: ' + report_param.unitname });
        }


        return pdfFormatted;
    }

    getTableObject(table) {
        const header = table.headers;
        const data = table.data;
        let reportTable: any;
        reportTable = {
            table: {
                headerRows: 1,
                widths: [],
                body: []
            }
        };
        let body = [];
        const length = header.length - 2;
        const count = Math.floor(496 / length);
        header.map(item => {
            reportTable.table.widths.push('auto');
            body.push({ text: item, style: 'tableHeader' });
        });
        reportTable.table.body.push(body);

        data.map(item => {
            reportTable.table.body.push(Object.values(item));
        });


        return reportTable;
    }

}