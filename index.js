module.exports = function (RED) {
    const {
        EventHubClient
    } = require("@azure/event-hubs");

    function AxonizeAzureContribEventHub(config) {
        // Create the Node-RED node
        RED.nodes.createNode(this, config);
        var node = this;
        this.config = config;
        node.on('input', function (msg) {
            var messageJSON = null;
            node.log(this.name);                        
            if(typeof msg.payload != "object" && typeof msg.payload != "string"){
                node.error("EventHubMessage - payload object is not valid");
            }          
            sendMessageToEventHub(node, this.config.connectionString, this.config.eventHubPath, typeof(msg.payload) == 'string' ? JSON.parse(msg.payload): msg.payload);
        });
    }

    // Registration of the node into Node-RED
    RED.nodes.registerType("axonizeSendAzureEventHubMessages", AxonizeAzureContribEventHub, {
        category: 'cloud',
        defaults: {
            name: {
                value: "Clovity - Send - Azure Event Hub",
                required: true
            },
            connectionString: {                                
                required: true
            },
            eventHubPath: {                   
                required: true
            }
        }        
    });

    var sendMessageToEventHub = function (node, connectionString, eventHubPath, message) { 
        try{
            const client = EventHubClient.createFromConnectionString(connectionString, eventHubPath);
            const eventData = {
                body: message
            };
            client.send(eventData);
            node.log("sent message to eventhub successfully");
        }   
        catch(e){
            node.error("could not send event hub message" + e.message);
        }             
    };
}