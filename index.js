module.exports = function (RED) {
    const {
        EventHubClient
    } = require("@azure/event-hubs");

    function ClovityAzureContribEventHub(config) {
        // Create the Node-RED node
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            var messageJSON = null;
            node.log(this.name);
            node.log(this.connectionString);
            node.log(this.eventHubPath);
            node.log(typeof msg.payload)
            node.log(JSON.stringify(msg.payload));
            sendMessageToEventHub(node, this.connectionString, this.eventHubPath, typeof(msg.payload) == 'string' ? JSON.parse(msg.payload): msg.payload);
        });
    }

    // Registration of the node into Node-RED
    RED.nodes.registerType("AxonizeSendAzureEventHubMessages", ClovityAzureContribEventHub, {
        defaults: {
            name: {
                value: "Clovity - Send - Azure Event Hub"
            },
            connectionString: {
                type: "text"
            },
            eventHubPath: {
                type: "text"
            }
        }        
    });

    var sendMessageToEventHub = function (node, connectionString, eventHubPath, message) { 
        const client = EventHubClient.createFromConnectionString(connectionString, eventHubPath);
        const eventData = {
            body: message
        };
        client.send(eventData);
    };
}