// create init function
function init(){
    buildPlot()
}

//changing the option function
function optionChanged() {
  
    // Building plot with new selection
    buildPlot();
  }


//Building the new plot
function buildPlot(){


    d3.json("samples.json").then((data) =>{
        //get a list of all the id names
        var idValues = data.names;
  
        // Create the drop down menu with all id names
        idValues.forEach(id => d3.select('#selDataset').append('option').text(id).property("value", id));


        // D3 function to select the current ID and store variable
        var currentID = d3.selectAll("#selDataset").node().value;
     

        //filter the data for the selected ID
        filteredID = data.samples.filter(entry => entry.id == currentID);

        // create Trace for the horizontal bar chart
        var trace1 = {
            x: filteredID[0].sample_values.slice(0,10).reverse(),
            y: filteredID[0].otu_ids.slice(0, 10).reverse().map(int => "OTU " + int.toString()),
            text: filteredID[0].otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: 'h'
        };
    
      
        // data
        var dataPlot = [trace1];

        // Layout
        var layout = {
            title : 'Top 10 OTU samples',
            margin: {
                l: 75,
                r: 100,
                t: 60,
                b: 60
            }

        };

        // Use plotly to create new bar
        Plotly.newPlot("bar", dataPlot, layout);

        // create the demographics panel
        filteredMeta = data.metadata.filter(entry => entry.id == currentID)
       
        // create a demographics object
        var demographics = {
            'id: ': filteredMeta[0].id,
            'ethnicity: ': filteredMeta[0].ethnicity,
            'gender: ': filteredMeta[0].gender,
            'age: ': filteredMeta[0].age,
            'location: ': filteredMeta[0].location,
            'bbtype: ': filteredMeta[0].bbtype,
            'wfreq: ': filteredMeta[0].wfreq
        }
        //select the id to append the key value pair under demographics panel
        panelBody = d3.select("#sample-metadata")

        // remove the current demographic info to make way for new currentID
        panelBody.html("")
        
        //append the key value pairs from demographics into the demographics panel
        Object.entries(demographics).forEach(([key, value]) => {
            panelBody.append('p').attr('style', 'font-weight: bold').text(key + value)
        });

        // Create the trace for the bubble chart
        var trace2 ={
            x : filteredID[0].otu_ids,
            y : filteredID[0].sample_values,
            text : filteredID[0].otu_labels,
            mode : 'markers',
            marker: {
                color : filteredID[0].otu_ids,
                size : filteredID[0].sample_values
            }
        }

        var data2 = [trace2]

        //create the layout for the bubble chart
        var layout2 = {
            title : 'Marker Size',
            showlegend : false, 
        }

        //plot plot plot with plotly
        Plotly.newPlot('bubble', data2, layout2)
        console.log(filteredID)
        gauge()
    });
};

//run init to  set the main page
init();



