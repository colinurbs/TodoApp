// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    
    var items = [];
    var task_number = null;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                document.getElementById("item").focus();
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
                document.getElementById("item").focus();
            }
            args.setPromise(WinJS.UI.processAll());

            // Add button. 
            var addButton = document.getElementById("addButton");
            addButton.addEventListener("click", addButtonClickHandler, false);

            // Clear button. 
            var clearButton = document.getElementById("clearButton");
            clearButton.addEventListener("click", clearButtonClickHandler, false);
            
            //enter button
            document.getElementById("body").addEventListener("keypress", keyHandler, false)

            //load items
            var appData = Windows.Storage.ApplicationData.current;
            var roamingSettings = appData.roamingSettings;
            var localFolder = appData.localFolder;
            localFolder.getFileAsync("dataFile.txt")
              .then(function (sampleFile) {
                  return Windows.Storage.FileIO.readTextAsync(sampleFile);
              }).done(function (data) {
                  items = JSON.parse(data);
                  draw();
              }, function () {
                  // Timestamp not found
              });
            if (roamingSettings.values["tasks"]) {
                task_number = roamingSettings.values["tasks"];
                document.getElementById('tasks').innerHTML = "<h4>" + task_number + " completed</h4>";
            }
          
            draw();

            
          

         
      
           
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    function addButtonClickHandler(eventInfo) {
        
        var item = document.getElementById("item").value;
        
        if (item) {
            items.push(item);
            console.log("adding");
            console.log(items);

            draw();
            document.getElementById("item").value = "";
            save();
        }
       
        
    }

    function keyHandler(key) {
        if (key['charCode'] == 13) {
            addButtonClickHandler();

        }
    }
    function redirect(e) {

        items.splice(this.id, 1);
        task_number += 1;
        document.getElementById('tasks').innerHTML = "<h4>"+task_number+" completed</h4>";
        draw();
        save();
    }

    function clearButtonClickHandler(eventInfo) {
      items = [];
       draw();
       save();

   }

    function save() {

       
        console.log("saving");
        console.log(items);
        var appData = Windows.Storage.ApplicationData.current;
        var roamingSettings = appData.roamingSettings;
        var localFolder = appData.localFolder;
        localFolder.createFileAsync("dataFile.txt", Windows.Storage.CreationCollisionOption.replaceExisting)
     .then(function (sampleFile) {
         var data = JSON.stringify(items);

         return Windows.Storage.FileIO.writeTextAsync(sampleFile, data);
     }).done(function () {
     });
        roamingSettings.values["tasks"] = task_number;

    }

  


    function draw() {
        
        document.getElementById('output').innerHTML = "";
            for (var i = 0; i < items.length; i++) {
                document.getElementById('output').innerHTML += "<div class='item' id='" + i + "'><div id='" + i + "' class='doneButton' ></div>" + items[i] + "</div>";
            }
         

            //add event listeners
            var d_items = document.getElementsByClassName('doneButton');
            for (var i = 0; i < d_items.length; i++) {
                d_items[i].addEventListener('click', redirect, false);
            }
        
    }

    app.start();
})();
