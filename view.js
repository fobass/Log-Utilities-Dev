"use strict";
let $ = require('jquery')
const ipc = require('electron').ipcRenderer
const dialog = require('electron').remote.dialog
const selectDirBtn = document.getElementById('select-directory')
var path = require('path');

require('datatables.net')();
let fs = require('fs')

let tabs = document.querySelector("#id_doctabs");

const logextension = ".log"
var logfileslist
var dirlist = []


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

});

tabs.addEventListener("select", (event) => {
    $('#jstree').jstree('deselect_all');
    $('#jstree').jstree('select_node', event.detail.innerText);

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
            if (logfileslist.length > 0) {
                dirlist.push(dir_name)
                $('#jstree').jstree().create_node('#' ,  { "id" : dir_name, "text" : dir_name, "icon" : "glyphicon glyphicon-folder-close white" }, "last", function(){
                    for (var logfile of logfileslist.values()){
                        $("#jstree").jstree().create_node(dir_name, { "id" : logfile, "text" : logfile, "icon": "glyphicon glyphicon-file white" },"last", ()=>{
                            this.set_icon(this, './images/logo.png')
                        });
                    }
                });
            } 
        })
    }    

}


$(function () {
    $("#jstree").jstree({
		"core" : { "check_callback" : true, "animation" : 0, "themes" : { "stripes" : true } },
		"plugins" : [ "themes", "html_data", "ui", "crrm", "wholerow", "changed" ]
    });
    // 7 bind to events triggered on the tree
    $('#jstree').on("changed.jstree", function (e, data) {
        if (dirlist.indexOf(data.selected[0]) == -1 && data.action == "select_node" && data.event.ctrlKey != true && data.event.shiftKey != true) {
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