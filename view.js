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
var Root_node
var Root_li
var ul 

const logextension = ".log"
var logfileslist


$('#id_doctabs').on("open", (event, title) => {
    // Don't open the default dummy tab
    event.preventDefault();
    // Create and open a new custom tab
    var existTab = document.getElementById(title + "_tab")
    if (existTab) {
        tabs.selectTab(existTab)
    } else {
        let tab = document.createElement("x-doctab");
        tab.setAttribute("id",title + "_tab")
        tab.innerHTML = "<x-label>"+ title + "</x-label>"
        tabs.openTab(tab); 
        tabs.selectTab(tab)
        
    }
    console.log(event) 
});

 $(document).ready( ()=> {
    $(document).on('click', '.sidebar-menu .nav-link', (e)=> {
        $(".sidebar-menu").find("li.active").removeClass("active");
        $(e.currentTarget).parent('li').addClass("active");
        
       
    });        
});

$('#add-folder').on( "click", (e)=> {
    dialog.showOpenDialog({properties: ['openDirectory']}, (dir)=> {
        if (dir) {
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

$('#jstree').on('changed.jstree', function (e, data) {
    var i, j, r = [];
    for(i = 0, j = data.selected.length; i < j; i++) {
      r.push(data.instance.get_node(data.selected[i]).text);
      console.log(data.selected[i]);
    }
    // if $(tab).pa
     $(tabs).trigger("open", [r] )
  })

function loadListOfFiles(dir) {
    if (dir) {
        fs.readdir(dir, (err, logdir)=>{
            logfileslist = logdir.filter((e)=>{
               return path.extname(e).toLowerCase() === logextension
            })
            $('#jstree').jstree().create_node('#' ,  { "id" : "ajson5", "text" : "ATP" }, "last", function(){
                for (var logfile of logfileslist.values()){
                    console.log(logfile) 
                    // addTreeViewNode(logfile) 
                    $("#jstree").jstree().create_node('ajson5', { "id" : logfile, "text" : logfile, "icon": "glyphicon glyphicon-leaf" },"last", ()=>{
                        this.set_icon(this, './images/logo.png')
                    });
                }
             }); 
        })
    }    

}

function addTreeViewNode(filename){
    $("#jstree").jstree("create",-1,false, filename ,false,true);
}


$(function () {
    $("#jstree").jstree({

		"core" : { "check_callback" : true, "animation" : 0 },
		"plugins" : [ "themes", "html_data", "ui", "crrm", "wholerow" ]
    });
    // 7 bind to events triggered on the tree
    $('#jstree').on("changed.jstree", function (e, data) {
      console.log(data.selected);
    });
    // 8 interact with the tree - either way is OK
    $('button').on('click', function () {
      $('#jstree').jstree(true).select_node('child_node_1');
      $('#jstree').jstree('select_node', 'child_node_1');
      $.jstree.reference('#jstree').select_node('child_node_1');
    });
        
  });