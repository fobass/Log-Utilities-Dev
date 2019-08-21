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
            // Root_node = document.createElement("ul");
            // Root_node.setAttribute('class','jstree-container-ul jstree-children')
            // Root_node.setAttribute('role', 'group')

            // Root_li = document.createElement("li");
            // Root_li.setAttribute('role', 'treeitem')
            // Root_li.setAttribute('arial-selected', 'false')
            // Root_li.setAttribute('arial-level', '1')
            // Root_li.setAttribute('aria-labelledby', 'j1_1_anchor')
            // Root_li.setAttribute('class', 'jstree-node  jstree-closed')
            // Root_li.textContent = "ATP";
            // ul = document.createElement("ul");
            // $("#jstree").jstree("create",-1,false,logfile,false,true); 
            $('#jstree').jstree().create_node('#' ,  { "id" : "ajson5", "text" : "ATP" }, "last", function(){
                for (var logfile of logfileslist.values()){
                    console.log(logfile) 
                    // addTreeViewNode(logfile) 
                    $("#jstree").jstree().create_node('ajson5', { "id" : logfile, "text" : logfile, "icon": "glyphicon glyphicon-leaf" },"last", ()=>{
                        this.set_icon(this, './images/logo.png')
                    });
                }
             }); 
            
            // Root_li.appendChild(ul)    
            // Root_node.appendChild(Root_li)
            // document.getElementById('jstree').appendChild(Root_node)
        })
    }    

}

function addTreeViewNode(filename){

//     <ul id="Root_node">
//     <li>Root node 1
//       <ul>
//         <li id="child_node_1">Child node 1</li>
//         <li>Child node 2</li>
//       </ul>
//     </li>
//     <li>Root node 2</li>
//   </ul>
    // $("#jstree").jstree("create")
    $("#jstree").jstree("create",-1,false, filename ,false,true);


    // var li = document.createElement("li");
    // li.textContent = filename
    // ul.appendChild(li)    
   
    // var elements = document.getElementsByClassName("tree-branch")
    // console.log(elements)
    // var cl = document.createElement("tree-indicator glyphicon-chevron-down")
    // elements[0].childNodes[0].className = "tree-indicator glyphicon glyphicon-chevron-down"
    // elements[0].removeChild(elements[0].childNodes[0]);
    // elements[0].appendChild(cl)
    // elements.removeChild(elements.childNodes[0]);  
    // for (var i = 0; i>elements.length; i++) {
    //     elements[i].classList.remove('tree-indicator glyphicon glyphicon-chevron-right')
    //     elements[i].classList.add('tree-indicator glyphicon-chevron-down')
    //  }

    // a.textContent = filename;
    // a.setAttribute('href', "#");
    // li.appendChild(a);
    // ul.appendChild(li);
    // var node = '<li><a href="#">ATP</a> <ul> <li></li> </ul>'
    // let tab = document.createElement("x-doctab");

//    document.getElementById('file-treeview').appendChild(ul)

}


$(function () {
    // 6 create an instance when the DOM is ready
    // $('#jstree').jstree();
    $("#jstree").jstree({

		"core" : { "check_callback" : true },
		"plugins" : [ "themes", "html_data", "ui", "crrm" ]
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