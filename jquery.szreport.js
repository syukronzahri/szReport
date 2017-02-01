/*************************************************
 *                                               *
 *  szReport.js                                  *
 *  -----------                                  *
 *  A simple JavaScript reporting library        *
 *                                               *
 *  Created by Syukron Zahri                     *
 *  Copyright (c) Syukron Zahri @ 2016           *
 *  Copy is permitted without any modifications  *
 *                                               *
 ************************************************/
 
 (function($){
    /*----------------------------------*/
    /*------- Internal functions -------*/
    /*----------------------------------*/

     /**
      * Clear report contents. Used before render report
      * @param szReportObj
      */
    function clearReport(szReportObj)
    {
        szReportObj.innerHTML = '';
    }

     /**
      * Get report object so the client can access object's internal manually.
      *
      * @param szReportObj
      * @returns {*}
      */
    function getSelf(szReportObj)
    {
        return szReportObj;
    }

     /**
      * Calculate the height of the body.
      * If body's height is taller than the size of paper height subtracted by header and footer's height,
      * the height is recalculated
      *
      * @param szReportObj
      * @param szPageSetting
      */
    function calculateArea(szReportObj)
    {
        var pageSetting = szReportObj.pageSetting;

        var remainingBodyHeight = pageSetting.height - (pageSetting.margin.top + pageSetting.margin.bottom + pageSetting.header.height + pageSetting.footer.height);
        if (pageSetting.body > remainingBodyHeight) {
            pageSetting.body = remainingBodyHeight;
        }
        
        szReportObj.setting = pageSetting;
    }

     /**
      * Generate CSS styling for report
      *
      * @param szReportObj
      */
    function generateReportStyle(szReportObj)
    {
        var tableStyle = "." + szReportObj.className + " table {border: " + szReportObj.pageSetting.border.width + "px solid " + szReportObj.pageSetting.border.color + "; width: 100%; border-collapse: collapse}";
        var cellStyle = "." + szReportObj.className + " table tr td {border: " + szReportObj.pageSetting.border.width + "px solid " + szReportObj.pageSetting.border.color + "}";
        var pageStyle = "." + szReportObj.className + " .page {" +
            "height: " + szReportObj.pageSetting.page.height.toString() + szReportObj.unit +
            "; max-height: " + szReportObj.pageSetting.page.height.toString() + szReportObj.unit +
            "; min-height: " + szReportObj.pageSetting.page.height.toString() + szReportObj.unit +
            "; width: " + szReportObj.pageSetting.page.width.toString() + szReportObj.unit +
            "; max-width: " + szReportObj.pageSetting.page.width.toString() + szReportObj.unit +
            "; min-width: " + szReportObj.pageSetting.page.width.toString() + szReportObj.unit +
            "; margin-top: " + szReportObj.pageSetting.margin.top + szReportObj.unit +
            "; margin-bottom: " + szReportObj.pageSetting.margin.bottom + szReportObj.unit +
            "; margin-left: " + szReportObj.pageSetting.margin.left + szReportObj.unit +
            "; margin-right: " + szReportObj.pageSetting.margin.right + szReportObj.unit +
            "}";
        var pageAreaStyle = "." + szReportObj.className + " .page-area {width: 100%}";
        var headerStyle = "." + szReportObj.className + " .header {height: " + szReportObj.pageSetting.header.height + szReportObj.unit + "; width: 100%}";
        var bodyStyle = "." + szReportObj.className + " .body {height: " + szReportObj.pageSetting.body.height + szReportObj.unit + "; width: 100%}";
        var footerStyle = "." + szReportObj.className + " .footer {height: " + szReportObj.pageSetting.footer.height + szReportObj.unit + "; width: 100%}";
        var tempWorkingAreaStyle = "." + szReportObj.className + " .temporary-working-area {visibility: hidden}";
        var rowStyle = "";

        var mediaPrintStyle = "@media print {" + "." + szReportObj.className + " .page {page-break-after: always}}";

        console.log(szReportObj.rowSetting);
        console.log(szReportObj.reportData);

        //for (var i = 0; i <= szReportObj.rowSetting.length; i++) {
        for (var i = 0; i <= szReportObj.rowSetting.length; i++) {
            //console.log(i + ": " + szReportObj.rowSetting[i].width.toString());
            //rowStyle += "." + szReportObj.className + " table tr td:nth-child(" +  (i + 1).toString() + ") {width: " + szReportObj.rowSetting[i].width.toString() + szReportObj.unit + "; min-width: " + szReportObj.rowSetting[i].width.toString() + szReportObj.unit + "; max-width: " + szReportObj.rowSetting[i].width.toString() + szReportObj.unit + "}\n";
            rowStyle += "." + szReportObj.className + " table tr td:nth-child(" +  (Number.parseInt(key) + 1).toString() + ") {width: " + szReportObj.rowSetting[key].width.toString() + szReportObj.unit + "; min-width: " + szReportObj.rowSetting[key].width.toString() + szReportObj.unit + "; max-width: " + szReportObj.rowSetting[key].width.toString() + szReportObj.unit + "}\n";
        }

        return tableStyle +
            "\n" + cellStyle +
            "\n" + pageStyle +
            "\n" + rowStyle +
            "\n" + headerStyle +
            "\n" + bodyStyle +
            "\n" + footerStyle +
            "\n" + pageAreaStyle +
            "\n" + mediaPrintStyle +
            "\n" + tempWorkingAreaStyle;
    }

     /**
      * Create <style> tag, used for styling the report
      *
      * @param szReportObj
      * @returns {Element}
      */
    function createStyle(szReportObj) {
        var reportStyle = document.createElement('style');

        szReportObj.appendChild(reportStyle);

        return reportStyle;
    }

     /**
      * Create a temporary working area. The working area is hidden
      * and the purpose is to calculate a row's height when rendering the report.
      *
      * @param szReportObj
      * @returns {Element}
      */
    function createTemporaryWorkingArea(szReportObj)
    {
        var tempContainer = document.createElement('div');
        tempContainer.classList.add('temporary-working-area');
        tempContainer.classList.add('page');

        var pageArea = createPageArea();

        tempContainer.appendChild(pageArea);
        szReportObj.appendChild(tempContainer);

        return tempContainer;
    }

     /**
      * Create page layout
      *
      * @param szReportObj
      * @returns {Element}
      */
    function createPage(szReportObj)
    {
        var page = document.createElement('div');
        page.classList.add('page');

        var pageArea = createPageArea();

        page.appendChild(pageArea);
        szReportObj.appendChild(page);
        
        return page;
    }

     /**
      * Create page area which consists of header, body and footer
      *
      * @param szReportObj
      * @returns {Element}
      */
    function createPageArea()
    {
        var pageArea = document.createElement('div');
        pageArea.classList.add('page-area');

        var pageHeader = createPageHeader();
        var pageBody = createPageBody();
        var pageFooter = createPageFooter();
        
        pageArea.appendChild(pageHeader);
        pageArea.appendChild(pageBody);
        pageArea.appendChild(pageFooter);
        
        return pageArea;
    }

     /**
      * Create header area
      *
      * @param height
      * @param unit
      * @returns {Element}
      */
    function createPageHeader()
    {
        var pageHeader = document.createElement('div');
        pageHeader.classList.add('header');
        
        return pageHeader;
    }

     /**
      * Create body area
      *
      * @param height
      * @param unit
      * @returns {Element}
      */
    function createPageBody()
    {
        var pageBody = document.createElement('div');
        pageBody.classList.add('body');

        var reportTable = pageBody.appendChild(document.createElement('table'));
        var reportTBody = reportTable.appendChild(document.createElement('tbody'));

        return pageBody;
    }

     /**
      * Create footer area
      *
      * @param height
      * @param unit
      * @returns {Element}
      */
    function createPageFooter()
    {
        var pageFooter = document.createElement('div');
        pageFooter.classList.add('footer');

        return pageFooter;
    }

     /**
      * Check whether a row can be inserted into a table from its remaining space
      *
      * @param szTableObj
      * @param szCheckedRowObj
      * @returns {boolean}
      */
    function isAbleToInsert(szTableObj, szCheckedRowObj)
    {
        var szPageBody = szTableObj.parentElement;
        
        if (szPageBody.clientHeight < (szTableObj.clientHeight + szCheckedRowObj.clientHeight)) {
            return false;
        }
        return true;
    }

     /**
      * Generate a row content.
      *
      * @param arrContent
      * @param szRowSetting
      * @returns {Element}
      */
    function createRow(arrContent)
    {
        var row = document.createElement('tr');
        var cell;
        
        for (key in arrContent) {
            cell = document.createElement('td');

            cell.innerHTML = arrContent[key];
            
            row.appendChild(cell);
        }
        
        return row;
    }

     /**
      * Render the report into page. Main working job
      *
      * @param szReportObj
      */
    function renderReport(szReportObj)
    {
        /*
            Initialize: Clear report
         */
        szReportObj.reportStyle.innerHTML = "";
        clearReport(szReportObj);

        /*
            Create report CSS style
         */
        var reportStyle = createStyle(szReportObj);
        reportStyle.innerHTML = generateReportStyle(szReportObj);

        /*
            Create a temporary working area
        */
        var temporaryWorkingArea = createTemporaryWorkingArea(szReportObj);
        var tempTBody = temporaryWorkingArea.children[0].children[1].children[0].children[0];

        /*
            Create a real report area
         */
        var page = createPage(szReportObj);
        var reportTable = page.children[0].children[1].children[0];
        var reportTBody = reportTable.children[0];
        
        var tempRow;

        /*
            Print each row of report data
         */
        for (rowIndex in szReportObj.reportData) {
            tempRow = createRow(szReportObj.reportData[rowIndex]);
            
            tempTBody.appendChild(tempRow);
            
            if (!isAbleToInsert(reportTable, tempRow)) {
                page = createPage(szReportObj);
                reportTable = page.children[0].children[1].children[0];
                reportTBody = reportTable.children[0];
            }
            
            tempTBody.removeChild(tempRow);
            reportTBody.appendChild(tempRow);
        }

        szReportObj.removeChild(temporaryWorkingArea);
    }

     /**
      * Import data into report
      *
      * @param szReportObj
      * @param data
      * @param executeStatus
      */
    function importData(szReportObj, data)
    {
        szReportObj.reportData = data;
        if (szReportObj.immediateRender) {
            renderReport(szReportObj);
        }
    }
    
    /*-----------------------------------------*/
    /*------- End of Internal functions -------*/
    /*-----------------------------------------*/
    
    /* Public method */
    var methods = {
        /**
         * Initialization
         * @param szReportObj
         * @param options
         */
        init: function(szReportObj, options){
            var self = szReportObj;

            var d = new Date();
            self.className = "szReport" + d.getTime();

            self.classList.add(self.className);

            /* Create style element */
            var reportStyle = document.createElement('style');
            self.reportStyle = reportStyle;

            /*
              Page Setting:
              - page: height, width
                - header: height
                - body: height
                - footer: height
                - margin: top, bottom, left, right
             */
            self.pageSetting = {
                page: {
                    height: 297,
                    width: 210,                    
                },
                header: {
                    height: 0
                },
                body: {
                    height: 0
                },
                footer: {
                    height: 0
                },
                margin: {
                    top: 15,
                    bottom: 15,
                    left: 10,
                    right: 10
                },
                border: {
                    width: 1,
                    color: '#000',
                }
            };

            /* Row setting, consists of each column width */
            self.rowSetting = [];

            /* The active unit, used in every measurement in this plugin */
            self.unit = 'mm';

            /* Content setting */
            self.contentSetting = undefined;
            
            self.container = self.parentElement;

            self.childNodes.top = 0;
            self.childNodes.left = 0;
            
            self.reportData = undefined;
            
            self.style.position = "relative";

            /* Render setting */
            self.immediateRender = true;      // immediate render

            /* No setting, return */
            if (typeof options === 'undefined') {
                return;
            }

            /* Pre-load page setting */
            if (typeof options.pageSetting === 'object') {
                if (typeof options.pageSetting.page.height != 'undefined') self.pageSetting.page.height = parseInt(options.pageSetting.page.height);
                if (typeof options.pageSetting.page.width != 'undefined') self.pageSetting.page.width = parseInt(options.pageSetting.page.width);
                if (typeof options.pageSetting.header.height != 'undefined') self.pageSetting.header.height = parseInt(options.pageSetting.header.height);
                if (typeof options.pageSetting.body.height != 'undefined') self.pageSetting.body.height = parseInt(options.pageSetting.body.height);
                if (typeof options.pageSetting.footer.height != 'undefined') self.pageSetting.footer.height = parseInt(options.pageSetting.footer.height);
                if (typeof options.pageSetting.margin.top != 'undefined') self.pageSetting.margin.top = parseInt(options.pageSetting.margin.top);
                if (typeof options.pageSetting.margin.bottom != 'undefined') self.pageSetting.margin.bottom = parseInt(options.pageSetting.margin.bottom);
                if (typeof options.pageSetting.margin.left != 'undefined') self.pageSetting.margin.left = parseInt(options.pageSetting.margin.left);
                if (typeof options.pageSetting.margin.right != 'undefined') self.pageSetting.margin.right = parseInt(options.pageSetting.margin.right);
                if (typeof options.pageSetting.border.width != 'undefined') self.pageSetting.border.width = parseInt(options.pageSetting.border.width);
                if (typeof options.pageSetting.border.color != 'undefined') self.pageSetting.border.color = options.pageSetting.border.color;
            }

            /* Pre-load row setting */
            if (typeof options.rowSetting != 'undefined' && options.rowSetting instanceof Array) {
                for (key in options.rowSetting) {
                    if (typeof options.rowSetting[key].width != 'undefined') {
                        self.rowSetting.push({width: options.rowSetting[key].width});
                    }
                }
            } else {
                self.rowSetting.push({width: 0});
            }

            /* Set active unit from client */
            if (typeof options.unit != 'undefined') {
                var validUnit = ['mm', 'cm', 'in', 'px', 'pt', 'em', '%'];
                var exist = false;
                
                for (index in validUnit) {
                    if (validUnit[index] == options.unit) {
                        exist = true;
                    }
                }
                
                if (exist) {
                    self.unit = options.unit;
                }
            }

            /* Pre-load report with data */
            if (typeof options.reportData != 'undefined' /* && options.reportData instanceof Array*/ ) {
                self.reportData = options.reportData;
            }

            /* Set immediate render */
            if (typeof options.immediateRender == "boolean") {
                self.immediateRender = options.immediateRender;
            }

            /* Calculate remaining report body's space and check if it's larger than paper body height */
            calculateArea(self);

            /*
                Render the report main job
             */
            if (self.immediateRender) {
                renderReport(self);
            }
        },
        getSelf: function(szReportObj){
            return getSelf(szReportObj);
        },
        exportData: function(szReportObj){
            return exportData(szReportObj);
        },
        importData: function(szReportObj, data, executeStatus){
            return importData(szReportObj, data, executeStatus);
        },
    };
    
    $.fn.szReport = function(params){
        var self = this.get(0);
        
        if (methods[params]) {
            return methods[params].call(this, self, Array.prototype.slice.call(arguments, 1)[0]);
        } else if (typeof params === 'object'){
            methods.init(self, params);
        } else if (typeof params === 'undefined') {
            methods.init(self);
        } else {
            $.error('Method ' +  params + ' does not exist on jQuery.szOftalmologisCanvas');
        }
                
        return this;
    }
})(jQuery);
