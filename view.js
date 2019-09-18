"use strict";
let $ = require('jquery')
const ipc = require('electron').ipcRenderer
const dialog = require('electron').remote.dialog
const selectDirBtn = document.getElementById('select-directory')
var path = require('path');
const https = require('https')
require('datatables.net')();
let fs = require('fs')

let tabs = document.querySelector("#id_doctabs");

const logextension = ".tclog"
var logfileslist
var dirlist = []
var logdirpath = ""
var dataSource = []
var rowIndex = 0
var tickerLog = new Map()

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

var fidStatusSenderCode       = 39;
var fidStatusTicketNo         = 42;
var fidStatusOMSOrderNo       = 43;
var fidStatusFixOrderNo       = 44;
var fidStatusClientAccount    = 46;
var fidStatusClientName       = 48;
var fidStatusBrokerCode       = 51;
var fidStatusAction           = 52;
var fidStatusTickerID         = 53;
var fidStatusOrderType        = 54;
var fidStatusOrderDateTime    = 55;
var fidStatusValidity         = 57;
var fidStatusOrigQty          = 59;
var fidStatusOrigPrice        = 60;
var fidStatusMatchQty         = 69;
var fidStatusMatchPrice       = 70;
var fidStatusStatusCode       = 73;
var fidStatusStatusText       = 74;
var fidStatusErrorNo          = 75;
var fidStatusLastUpdate       = 76;
var fidStatusRemark           = 77;
var fidStatusBranchCode       = 81;
var fidStatusExchCode         = 123;
var fidStatusAppClicode       = 125; 
var fidStatusQtyTodayMatch    = 161;
var fidStatusViewCond         = 222;
var fidTicketQty              = 59;
var fidTicketPrice            = 60;

  
function tickerLogType(values){

}



$('#id_doctabs').on("open", (event, title) => {
    // Don't open the default dummy tab
    event.preventDefault();
    // Create and open a new custom tab
    var existTab = document.getElementById(title + "_tab")
    if (existTab) {
        tabs.selectTab(existTab)
        selectTabContent(title)
    } else {
        let tab = document.createElement("x-doctab");
        tab.setAttribute("id",title + "_tab")
        tab.innerHTML = "<x-label>"+ title + "</x-label>"
        tabs.openTab(tab); 
        tabs.selectTab(tab)
        openTabContent(title)
        selectTabContent(title)
    }    
});

function openTabContent(title) {
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("id_tab_content");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    let id_content = title.replace('.','') + '_box'  
    let box = document.createElement("x-box");
        box.setAttribute("id", id_content)
        box.setAttribute("class", "id_tab_content")
        box.textContent = title
        // box.innerHTML = '<object type="text/html" data="atp.html" >'+ title + '</object>'
    
    var content = document.getElementById("content")
        content.appendChild(box)

    $('#'+ id_content).load('./html/orderlog.html', ()=>{
        document.getElementById("c_h2").setAttribute("id", id_content + "_h2")
        document.getElementById(id_content + '_h2').innerHTML = '<h1>' + title + '</h1>'
        document.getElementById("example").setAttribute("id", id_content + "_table")
        LoadFiles(title)
        $('#' + id_content + "_table").DataTable({
            autoFill: true,
            data: dataSource,
            columns : [
                { data: 'LogDt' },
                { data: 'SourceID' },
                { data: 'OrderDateTime' },
                { data: 'TicketNo' },
                { data: 'OMSOrdNoName' },
                { data: 'FixOrderNo' },
                { data: 'ClientName' },
                { data: 'ClientAccount' },
                { data: 'ClientBrokerCD' },
                { data: 'ClientBranchCD' },
                { data: 'ClientExch' },
                { data: 'Status' },
                { data: 'StatusText' },
                { data: 'Action' },
                { data: 'Price' },
                { data: 'Qty' },
                { data: 'OrigPri' },
                { data: 'OrigQty' },
                { data: 'MatchPrice' },
                { data: 'MatchQty' },
                { data: 'QtyTodayMatch' },
                { data: 'Validity' },
                { data: 'OrderType' },
                { data: 'SenderCode' },
                { data: 'LastUpdateDt' },
                { data: 'ViewCond' },
                { data: 'ErrorNo' },
                { data: 'AppCliCode' }
                // { data: 'Remark' }
            ]
            // scrollResize: true,
            // scrollY: 500,
            // scrollCollapse: true,
            // paging: false
        });

        // dataSource =     [
        //     "Tiger Nhitect System Architect",
        //     "STiger ystem Architect System Architectystem Architect",
        //     "EdinbTigystem Architecturgh",
        //     "5Tiger  System Architect Tiger Nixon System Architect System Architect System Architect421",
        //     "2011/Tiger NiArchitect System Architect04/25",
        //     "$3,1Tiger  Architect20"
        // ]
    })
   
    
  }

function addToTableRow(ordDate, rawData, sType){
    var stTypeNo = "("+ sType +")"
    var stName = ""
    var value = ""
    switch (sType) {
        case '79': stName += stTypeNo + 'afReviseOrder'
            break;
        case '80': stName += stTypeNo + 'afNewOrder'
            break;
        case '82': stName += stTypeNo + 'afOrderTicket'
            break;
        case '83': stName += stTypeNo + 'afOrderStatus'
            break;
        case '86': stName += stTypeNo + 'afOrderTicketDone'
            break;
        case '87': stName += stTypeNo + 'afOrderResend'
            break;
        case '88': stName += stTypeNo + 'afPushOrderStatus'
            break;
        case '90': stName += stTypeNo + 'ChgQtyPrice'
            break;
        case '63': stName += stTypeNo + 'InstMaster'
            break;
        case '64': stName += stTypeNo + 'InstDetail'
            break;
        
        default: stName += stTypeNo
            break;
    }    

    switch (sType) {
        case '79': 
        case '80':
        case '82': 
        case '83': 
        case '86': 
        case '87': 
        case '88': 
              //let [TicketNo, OrderDateTime, OMSOrdNo, Remark, LastUpdateDt, StatusText, TickerID] = rawData.split('|')
              var fidvalue = rawData.split("|")
              var updateVal = {}
              fidvalue.forEach((fidval) => {
              if (fidval){
                var fid = fidval.split("=")[0].charCodeAt(0)
                fidval.split("=")[1] = "Nulll"
                  switch (fid) {
                      case fidStatusTicketNo: updateVal['TicketNo'] = fidval.split("=")[1]; break;
                      case fidStatusOMSOrderNo: updateVal['OMSOrdNoName'] = fidval.split("=")[1]; break;
                      case fidStatusFixOrderNo: updateVal['FixOrderNo'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('').AsString := AReader.Data[i];
                      case fidStatusClientAccount: updateVal['ClientAccount'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('ClientAccount').AsString := AReader.Data[i];
                      case fidStatusClientName: updateVal['ClientName'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('ClientName').AsString := AReader.Data[i];
                      case fidStatusBrokerCode: updateVal['ClientBrokerCD'] = fidval.split("=")[1]; break;//ADataSet.FieldByName('ClientBrokerCD').AsString := AReader.Data[i];
                      case fidStatusAction: updateVal['Action'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName(dsActionName).AsString := AReader.Data[i];
                      case fidStatusTickerID: updateVal['TickerID'] =  fidval.split("=")[1]; break; //ADataSet.FieldByName(dsTickerIDName).AsString := AReader.Data[i];
                      case fidStatusOrderType: updateVal['OrderType'] =  fidval.split("=")[1]; break;// ADataSet.FieldByName('OrderType').AsString := AReader.Data[i];
                      case fidStatusOrderDateTime: updateVal['OrderDateTime'] =  fidval.split("=")[1]; break;// ADataSet.FieldByName(dsOrderDateTimeName).AsDateTime := TimeStamp(AReader.Data[i]);
                      case fidStatusValidity: updateVal['Validity'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('Validity').AsString := AReader.Data[i];
                      case fidStatusOrigQty: updateVal['OrigQty'] =  fidval.split("=")[1]; 
                                              updateVal['Qty'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('OrigQty').AsInteger := AsInteger(AReader.Data[i]);
                      case fidStatusOrigPrice:  updateVal['OrigPri'] =  fidval.split("=")[1];
                                                updateVal['Price'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('OrigPrice').AsFloat := AsDouble(AReader.Data[i]);
                      case fidStatusMatchQty: updateVal['MatchQty'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('MatchQty').AsInteger := AsInteger(AReader.Data[i]);
                      case fidStatusMatchPrice: updateVal['MatchPrice'] =  fidval.split("=")[1]; break;// ADataSet.FieldByName('MatchPrice').AsFloat := AsDouble(AReader.Data[i]);
                      case fidStatusStatusCode: updateVal['Status'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('Status').AsString := AReader.Data[i];
                      case fidStatusStatusText: updateVal['StatusText'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName(dsStatusTextName).AsString := AReader.Data[i];
                      case fidStatusErrorNo: updateVal['ErrorNo'] =  fidval.split("=")[1];
                                            updateVal['ViewCond'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('ErrorNo').AsInteger := AsInteger(AReader.Data[i]);
                      case fidStatusLastUpdate: updateVal['LastUpdateDt'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName(dsLastUpdateDtName).AsDateTime := TimeStamp(AReader.Data[i]);
                      case fidStatusRemark: updateVal['Remark'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName(dsRemarkName).AsString := AReader.Data[i];
                      case fidStatusBranchCode: updateVal['ClientBranchCD'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('ClientBranchCD').AsString := AReader.Data[i];
                      case fidStatusExchCode: updateVal['ClientExch'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('ClientExch').AsString := AReader.Data[i];
                      case fidStatusAppClicode: updateVal['AppCliCode'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('AppCliCode').AsString := AReader.Data[i];
                      case fidStatusQtyTodayMatch: updateVal['QtyTodayMatch'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('QtyTodayMatch').AsInteger := AsInteger(AReader.Data[i]);
                      case fidStatusSenderCode: updateVal['SenderCode'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('SenderCode').AsString := AReader.Data[i];
                      case fidStatusViewCond: updateVal['ViewCond'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('ViewCond').AsString := AReader.Data[i];
                      case fidTicketQty: updateVal['Qty'] =  fidval.split("=")[1]; break;// ADataSet.FieldByName('Qty').AsInteger := AsInteger(AReader.Data[i]);
                      case fidTicketPrice: updateVal['Price'] =  fidval.split("=")[1]; break;//ADataSet.FieldByName('Price').AsFloat := AsDouble(AReader.Data[i]);
                       default:                  
                          break;
                  }
                }
              })

              updateVal['LogDt'] = ordDate
              updateVal['SourceID']= stName
              updateVal['OrderDateTime'] = ordDate
            if (dataSource.length < 5)
              dataSource.push(updateVal) 
        
        default: 
            break;
    } 
    

    // var fidvalue = rawData.split("|")
    // fidvalue.forEach((fidval) => {
    //     if (fidval){
    //         var fid = fidval.split("=")[0].charCodeAt(0)
    //         var value = fidval.split("=")[1]
    //         switch (fid) {
    //             case fidStatusTicketNo         : 
    //             case fidStatusOMSOrderNo       : //ADataSet.FieldByName(dsOMSOrdNoName).AsString := AReader.Data[i];
    //             case fidStatusFixOrderNo       : //ADataSet.FieldByName('FixOrderNo').AsString := AReader.Data[i];
    //             case fidStatusClientAccount    : //ADataSet.FieldByName('ClientAccount').AsString := AReader.Data[i];
    //             case fidStatusClientName       : //ADataSet.FieldByName('ClientName').AsString := AReader.Data[i];
    //             case fidStatusBrokerCode       : //ADataSet.FieldByName('ClientBrokerCD').AsString := AReader.Data[i];
    //             case fidStatusAction           : //ADataSet.FieldByName(dsActionName).AsString := AReader.Data[i];
    //             case fidStatusTickerID         : //ADataSet.FieldByName(dsTickerIDName).AsString := AReader.Data[i];
    //             case fidStatusOrderType        :// ADataSet.FieldByName('OrderType').AsString := AReader.Data[i];
    //             case fidStatusOrderDateTime    :// ADataSet.FieldByName(dsOrderDateTimeName).AsDateTime := TimeStamp(AReader.Data[i]);
    //             case fidStatusValidity         : //ADataSet.FieldByName('Validity').AsString := AReader.Data[i];
    //             case fidStatusOrigQty          : //ADataSet.FieldByName('OrigQty').AsInteger := AsInteger(AReader.Data[i]);
    //             case fidStatusOrigPrice        : //ADataSet.FieldByName('OrigPrice').AsFloat := AsDouble(AReader.Data[i]);
    //             case fidStatusMatchQty         : //ADataSet.FieldByName('MatchQty').AsInteger := AsInteger(AReader.Data[i]);
    //             case fidStatusMatchPrice       :// ADataSet.FieldByName('MatchPrice').AsFloat := AsDouble(AReader.Data[i]);
    //             case fidStatusStatusCode       : //ADataSet.FieldByName('Status').AsString := AReader.Data[i];
    //             case fidStatusStatusText       : //ADataSet.FieldByName(dsStatusTextName).AsString := AReader.Data[i];
    //             case fidStatusErrorNo          : //ADataSet.FieldByName('ErrorNo').AsInteger := AsInteger(AReader.Data[i]);
    //             case fidStatusLastUpdate       : //ADataSet.FieldByName(dsLastUpdateDtName).AsDateTime := TimeStamp(AReader.Data[i]);
    //             case fidStatusRemark           : //ADataSet.FieldByName(dsRemarkName).AsString := AReader.Data[i];
    //             case fidStatusBranchCode       : //ADataSet.FieldByName('ClientBranchCD').AsString := AReader.Data[i];
    //             case fidStatusExchCode         : //ADataSet.FieldByName('ClientExch').AsString := AReader.Data[i];
    //             case fidStatusAppClicode       : //ADataSet.FieldByName('AppCliCode').AsString := AReader.Data[i];
    //             case fidStatusQtyTodayMatch    : //ADataSet.FieldByName('QtyTodayMatch').AsInteger := AsInteger(AReader.Data[i]);
    //             case fidStatusSenderCode       : //ADataSet.FieldByName('SenderCode').AsString := AReader.Data[i];
    //             case fidStatusViewCond         : //ADataSet.FieldByName('ViewCond').AsString := AReader.Data[i];
    //                                             value = fidval.split("=")[1]
    //                 break;
    //             default:
    //                 break;
                
    //         }
    //        dataSource.insert(rowIndex, value)
    //         console.log(fidval.split("="))
    //     }
    // })

}

function LoadFiles(filename_) {
    if (filename_ != "Welcome") {
        var filename = logdirpath + '\\' + filename_
        //Check if file exists
        if (fs.existsSync(filename)) {
            let data = fs.readFileSync(filename, 'utf8').split('\n')
            if (data) {
                dataSource = []
                tickerLog.clear()
                data.forEach((contact, index) => {
                    if (contact != "") {
                        let [LogDtSourceID] =  contact.split('|') 
                        let [LogDt, SourceID] = LogDtSourceID.split(' ')
                        // let [LogDt1, SourceID2, TicketNo, OrderDateTime, OMSOrdNo, Remark, LastUpdateDt, StatusText, TickerID] = contact.split('|')
                        var rawData = contact.substring(contact.indexOf("||") + 2, contact.length)
                        addToTableRow(LogDt, rawData, SourceID.trim())
                        // dataSource.push([LogDt, SourceID, OrderDateTime, TicketNo, OMSOrdNo, Remark, LastUpdateDt, StatusText, TickerID])
                        // console.log(LogDt + SourceID)
                    }
                })
            }
        } else {
            console.log("File Doesn\'t Exist. Creating new file.")
            fs.writeFile(filename, '', (err) => {
                if (err)
                    console.log(err)
            })
        }
    }
}

function DoDecryptFile(filename){
    if (filename && filename !="\\Welcome") {
        var data = JSON.stringify({
            path: filename
        })

        var options = {
            host: 'localhost',
            port: 44359,
            path: '/api/values',
            "rejectUnauthorized": false,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        var req = https.request(options, (res) => {

            var str = ""
            res.on('data', function (chunk) {
                str += chunk;
              })
            
            res.on('end', function () {
                console.log(req.data);
                console.log(str);
                if (str == "true"){
                    loadListOfFiles(logdirpath)
                }
                
              })
        })

        // req.on('error', (error) => {
        //     console.error(error)
        // })

        req.write(data)
        req.end()
    }
}

tabs.addEventListener("select", (event) => {
    $('#jstree').jstree('deselect_all');
    $('#jstree').jstree('select_node', event.detail.innerText);
    selectTabContent(event.detail.innerText)

});

function selectTabContent(title) {
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("id_tab_content");
    for (i = 0; i < tabcontent.length; i++) {
       tabcontent[i].style.display = "none";
    }
    if (title) {
        let id_content = title.replace('.','') + '_box'  
        document.getElementById(id_content).style.display = "contents";
        
    }
}

$('#id_doctabs').on("close", (event, title) => {
    closeTabContent(event.detail.innerText)
    if (event.detail.nextSibling)
        selectTabContent(event.detail.nextSibling.innerText)
    else if (event.detail.previousSibling)
        selectTabContent(event.detail.previousSibling.innerText)

});

function closeTabContent(title){
    let id_content = title.replace('.','') + '_box' 
    document.getElementById(id_content).remove()

}

$(document).ready( ()=> {
    $(document).on('click', '.sidebar-menu .nav-link', (e)=> {
        $(".sidebar-menu").find("li.active").removeClass("active");
        $(e.currentTarget).parent('li').addClass("active");
    }); 

});

$('#add-folder').on( "click", (e)=> {
    dialog.showOpenDialog({properties: ['openDirectory']}, (dir)=> {
        if (dir) {
                fs.readdir(dir[0], (err, logdir)=> {
                    logfileslist = logdir.filter((e)=>{
                       return path.extname(e).toLowerCase() === logextension
                    })
                    logdirpath = dir[0]
                    DoDecryptFile(logdirpath)
                })

            //loadListOfFiles(dir[0])
        }
    })

});

ipc.on('file-path', function (event, path) {
    document.getElementById('file-path').innerHTML = path
    
})

window.addEventListener('contextmenu', (event)=>{
    event.preventDefault()
    ipc.send('show-context-menu')

})

$('#jstree').on('close_all.jstree', function (e, data) {
    var i, j, r = [];
    for(i = 0, j = data.selected.length; i < j; i++) {
      r.push(data.instance.get_node(data.selected[i]).text);
      console.log(data.selected[i]);
    }
    $(tabs).trigger("open", [r])

})

$('#jstree').on('after_close.jstree', function (e, data) {
    $('#jstree').jstree(true).set_icon(data.node, "glyphicon glyphicon-folder-close white");

  })

$('#jstree').on('after_open.jstree', function (e, data) {
    $('#jstree').jstree(true).set_icon(data.node, "glyphicon glyphicon-folder-open white");
    
})

function loadListOfFiles(dir) {
    if (dir) {
        var dir_name = dir.substring(dir.lastIndexOf('\\') + 1, dir.length)
        fs.readdir(dir, (err, logdir)=> {
            logfileslist = logdir.filter((e)=>{
               return path.extname(e).toLowerCase() === logextension
            })
            logdirpath = dir
            if (logfileslist.length > 0 && dirlist.indexOf(dir_name) == -1) {
                dirlist.push(dir_name)
                $('#jstree').jstree().create_node('#' ,  { "id" : dir_name, "text" : dir_name, "icon" : "glyphicon glyphicon-folder-close white" }, "last", function(){
                    for (var logfile of logfileslist.values()){
                        var text = logfile.substring(logfile.lastIndexOf('_') + 1, logfile.length)
                        $("#jstree").jstree().create_node(dir_name, { "id" : logfile, "text" : text, "icon": "glyphicon glyphicon-file white" },"last", ()=>{
                            this.set_icon(this, './images/logo.png')
                        });
                    }
                });
            } 
        })
    }    

}


$(function () {

    $(tabs).trigger("open", "Welcome")

    $("#jstree").jstree({
		"core" : { "check_callback" : true, "animation" : 0, "themes" : { "stripes" : true } },
		"plugins" : [ "themes", "html_data", "ui", "crrm", "wholerow", "changed" ]
    });
    // 7 bind to events triggered on the tree
    $('#jstree').on("changed.jstree", function (e, data) {
        if (dirlist.indexOf(data.selected[0]) == -1 && data.action == "select_node") {
            // if (data.event.ctrlKey != true && data.event.shiftKey != true) {
                var count = 0, i, j, r = [];
                for(i = 0, j = data.selected.length; i < j; i++) {
                    r.push(data.instance.get_node(data.selected[i]).text);
                    console.log(data.selected[i]);
                    count = i
                }
                $(tabs).trigger("open", [data.selected[count]] )
        }

    });

    $('#jstree').on('closed_node.jstree', function (e, data) {
            console.log(data.selected[i]);
    }); 
});