"use strict";
let $ = require('jquery')
const ipc = require('electron').ipcRenderer
const dialog = require('electron').remote.dialog
const selectDirBtn = document.getElementById('select-directory')

require('datatables.net')();
let fs = require('fs')
let filename = '2018-11-13_Ticket.log'
let sno = 0
let dataSet = []
let tabs = document.querySelector("#id_doctabs");



$('#id_doctabs').on("open", (event, title) => {
    // Don't open the default dummy tab
    event.preventDefault();
    // Create and open a new custom tab
    {
        let tab = document.createElement("x-doctab");
        tab.innerHTML = "<x-label>"+ title + " - " + tabs.childElementCount + "</x-label>";
        tabs.openTab(tab); 
        tabs.selectTab(tab)
    }
    console.log(event) 
});

 $(document).ready( ()=> {
    $(document).on('click', '.sidebar-menu .nav-link', (e)=> {
        $(".sidebar-menu").find("li.active").removeClass("active");
        $(e.currentTarget).parent('li').addClass("active");
        
        $(tabs).trigger("open", [e.currentTarget.id] )
    });

    $(document).on( "click", '#load-file' , (e)=> {
        dialog.showOpenDialog({
            properties: ['openFile']
            }, function (files) {
            if (files) {
                console.log(files);
                document.getElementById('file-path').value = files
                filename = files[0]
                loadAndDisplayContacts()
                prepareTable()
            }
            // event.sender.send('file-path, files')
            })
    });

    // $('div.split-pane').splitPane();
    // $('.split-pane-divider').on('click', function () {
    //     console.log("click");
    // })
        
});

ipc.on('file-path', function (event, path) {
    document.getElementById('file-path').innerHTML = path
})

window.addEventListener('contextmenu', (event)=>{
    event.preventDefault()
    ipc.send('show-context-menu')
})

$('#sendIPCSync').on('click', ()=> {
    const reply = ipc.sendSync('somemsg', "Hello world")
    const msg = `Sync message reply: ${reply} - ${sno++}`
    console.log(reply)
    document.getElementById('respICPSync').innerHTML = msg
})

$('#sendIPCAsync').on('click', ()=> {
    const reply = ipc.send('asynchronous-message', 'That one small step for man')
    const msg = `Async message reply: ${reply} - ${sno++}`
    console.log(reply)
    document.getElementById('respICPAsync').innerHTML = msg
    
})

function addEntry(LogDt, SourceID, OrderDateTime, TicketNo) {
    if (LogDt && SourceID && OrderDateTime && TicketNo) {
        sno++
        let updateString = '<tr><td>' + LogDt + '</td><td>' + SourceID + '</td><td>' +
            OrderDateTime + '</td></tr>' + TicketNo + '</td></tr>'
        $('#data-table').append(updateString)
    }
}

function prepareTable(){
    $(document).ready(function () {
        $('#data-table').DataTable({
           "scrollX": true,
            "scrollY": "70vh",
            "scrollCollapse": true,
            data : dataSet,
            columns: [
                { title: 'LogDt' },
                { title: 'SourceID' },
                { title: 'OrderDateTime'},
                { title: 'TicketNo'},
                { title: 'TicketNo'},
                { title: 'TicketNo'},
            ]
        });
    $('.dataTables_length').addClass('bs-select');
    });
}

function updateTableData(data){
    if (data){
        data.forEach((ticketLog, index) => {
            let [LogDt, Space, SourceID, OrderDateTime, TicketNo, m, s] = ticketLog.split('|')
            let v = [LogDt, SourceID, OrderDateTime, TicketNo, m, s]
            dataSet.push(v)
        })
    }
}

function loadAndDisplayContacts() {

    //Check if file exists
    if (fs.existsSync(filename)) {
        let data = fs.readFileSync(filename, 'utf8').split('\n')
        updateTableData(data)
        // data.forEach((ticketLog, index) => {
        //     let [LogDt, Space, SourceID, OrderDateTime, TicketNo] = ticketLog.split('|')
        //     addEntry(LogDt, SourceID, OrderDateTime, TicketNo)
        // })

    } else {
        console.log("File Doesn\'t Exist. Creating new file.")
        fs.writeFile(filename, '', (err) => {
            if (err)
                console.log(err)
        })
    }
}

