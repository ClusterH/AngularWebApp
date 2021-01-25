import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';

@Injectable()
export class ExcelService {
    report_cList: any[];
    reportName: string = '';

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private datePipe: DatePipe) { }
    async generateExcel(table) {
        this.reportName = '';
        // Excel Title, Header, Data
        const report_param = JSON.parse(localStorage.getItem('report_result'));
        let reportName = report_param.reportname.split('_');
        for (let i = 1; i < reportName.length; i++) {
            this.reportName += reportName[i] + ' ';
        }

        const title = this.reportName + ' ' + 'Report';
        const header = table.headers;
        const data = table.data;
        // Create workbook and worksheet
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(`${this.reportName}`);
        //default column width
        worksheet.properties.defaultColWidth = 30;
        // Add Row and formatting
        const titleRow = worksheet.addRow([title]);
        titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
        worksheet.addRow(['Run On : ' + report_param.runondate]);
        worksheet.addRow(['Company : ' + report_param.companyname]);
        if (report_param.groupname) {
            worksheet.addRow(['Group : ' + report_param.groupname]);
        }
        if (report_param.unitname) {
            worksheet.addRow(['Unit : ' + report_param.unitname]);
        }
        worksheet.addRow(['From : ' + report_param.datefrom]);
        worksheet.addRow(['To : ' + report_param.dateto]);
        if (localStorage.getItem('total_length')) {
            worksheet.addRow(['Total : ' + localStorage.getItem('total_length')]);
        } else {
            worksheet.addRow(['Total : ' + '0']);
        }
        // Blank Row
        worksheet.addRow([]);
        // Add Header Row
        const headerRow = worksheet.addRow(header);
        // Cell Style : Fill and Border
        headerRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' },
                bgColor: { argb: 'FF0000FF' }
            };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
        // Add Data and Conditional Formatting
        data.forEach(d => {
            const row = worksheet.addRow(d);
        });
        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data: any) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `TrackingXL_${report_param.reportname}.xlsx`);
        });
    }
}