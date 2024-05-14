let orderNumber = 0;
let botNumber = 0;
let ordersArray = [];
let botOrdersArray = [];

let processOrderArray = [];
let completeOrderArray = [];

function createOrder(orderType) {
    let order = {
        type: orderType,
        id: ++orderNumber
    };
    ordersArray.push(order);
    appendText(order.type + " Order " + order.id + " produced");
    let bot = botOrdersArray.find(bot => bot.order.length === 0);
    if(bot){
        bot.status = 'Active';
        processOrder(bot);
    }
    else{
        updatePendingTable();
    }
}

function createBot() {
    let bot = {
        type: 'Bot',
        id: ++botNumber,
        order: []
    };
    appendText("Bot " + botNumber + " created");
    botOrdersArray.push(bot);
    if(ordersArray.length > 0){
        bot.status = "Active";
        processOrder(bot);
    }
}

function popBot() {
    if (botOrdersArray.length > 0){                                                                         
        let bot = botOrdersArray[botOrdersArray.length -1];
        if(bot.order.length > 0){
            let orderCancelled =  bot.order[0]; 
            appendText("Processing " + orderCancelled.type + " Order " + orderCancelled.id + " cancelled");
            let index = processOrderArray.findIndex(x => x === orderCancelled);
            processOrderArray.splice(index, 1);
            ordersArray.unshift(orderCancelled);
            updatePendingTable();
            checkTable(processOrderArray,'PROCESSING-body');
            bot.order.pop();
        }
        appendText("Bot " + bot.id + " removed");
        botOrdersArray.pop();
    }
}

function updateTable(array,table) {  
    array.forEach(order => {
        if(order){
            let row = document.createElement("tr");
            let cell = document.createElement("td");
            cell.textContent = `${order.type} Order ${order.id}`;
            row.appendChild(cell);
            table.appendChild(row);
    }
    })
}

function updatePendingTable(){
    vipOrders = ordersArray.filter(order => order.type === 'VIP');
    normalOrders = ordersArray.filter(order => order.type === 'Normal');
    let table = document.getElementById('PENDING-body');
    table.innerHTML = "";
    updateTable(vipOrders,table);
    updateTable(normalOrders,table);
}

function checkTable(array,tableType){
    let table = document.getElementById(tableType);
    table.innerHTML = "";
    updateTable(array,table);
}

function appendText(text) {
    let table = document.getElementById('TextBox');
    var newText = document.createElement('p');
    newText.textContent = text;
    table.appendChild(newText);
    table.scrollTop = table.scrollHeight; 
}

function processOrder(bot){
    if(ordersArray.length == 0 ){
        return;
    }
    let order = ordersArray.find(order => order.type === 'VIP');
    if(order == undefined || order == null){
        order = ordersArray.find(order => order.type === 'Normal');
    }
    appendText("Bot " + bot.id + " processing " + order.type + " Order " + order.id);
    let index = ordersArray.findIndex(x => x === order);
    ordersArray.splice(index, 1);
    updatePendingTable();
    processOrderArray.push(order);
    checkTable(processOrderArray,'PROCESSING-body')
    
    bot.order.push(order);
    setTimeout(() => {
        if(bot.order.length > 0){
            appendText(order.type + " Order " + order.id + " completed");
            bot.order.pop();
            order = processOrderArray.shift();
            completeOrderArray.push(order);
            checkTable(processOrderArray,'PROCESSING-body')
            checkTable(completeOrderArray,'COMPLETE-body')
            processOrder(bot);
    }
    }, 10000);
}
