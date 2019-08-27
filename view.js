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
        $('#' + id_content + "_table").DataTable({
            autoFill: true
        });
    })
   
    
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