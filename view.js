"use strict";
let $ = require('jquery')
const ipc = require('electron').ipcRenderer
const dialog = require('electron').remote.dialog
const selectDirBtn = document.getElementById('select-directory')
var path = require('path');

require('datatables.net')();
let fs = require('fs')
let filename = '2018-11-13_Ticket.log'
let sno = 0
let dataSet = []
let tabs = document.querySelector("#id_doctabs");

const logextension = ".log"
var logfileslist


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
});

$('#add-folder').on( "click", (e)=> {
    dialog.showOpenDialog({properties: ['openDirectory']}, (dir)=> {
        if (dir) {
            console.log(dir[0]);
            loadListOfFiles(dir[0])
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

function loadListOfFiles(dir) {
    if (dir) {
        fs.readdir(dir, (err, logdir)=>{
            logfileslist = logdir.filter((e)=>{
               return path.extname(e).toLowerCase() === logextension
            })
            for (var logfile of logfileslist.values()){
                console.log(logfile) 
                addTreeViewNode(logfile) 
            }
        })
    }    

}

function addTreeViewNode(filename){

    var ul = document.getElementById("file-treeview-ul");
    var li = document.createElement("li");
    var a = document.createElement("a");
    var elements = document.getElementsByClassName("tree-branch")
    console.log(elements)
    // var cl = document.createElement("tree-indicator glyphicon-chevron-down")
    elements[0].childNodes[0].className = "tree-indicator glyphicon glyphicon-chevron-down"
    // elements[0].removeChild(elements[0].childNodes[0]);
    // elements[0].appendChild(cl)
    // elements.removeChild(elements.childNodes[0]);  
    // for (var i = 0; i>elements.length; i++) {
    //     elements[i].classList.remove('tree-indicator glyphicon glyphicon-chevron-right')
    //     elements[i].classList.add('tree-indicator glyphicon-chevron-down')
    //  }

    a.textContent = filename;
    a.setAttribute('href', "#");
    li.appendChild(a);
    ul.appendChild(li);
    // var node = '<li><a href="#">ATP</a> <ul> <li></li> </ul>'
    // let tab = document.createElement("x-doctab");

//    document.getElementById('file-treeview').appendChild(ul)

}
