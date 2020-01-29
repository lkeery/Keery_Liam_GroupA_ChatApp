// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

function setUserId({sID}) {
    //debugger;
    console.log(sID);
    vm.socketID = sID;
}

function showDisconnectMessage() {
    console.log('A user disconnected');
}

function appendMessage(message) {
    vm.messages.push(message);
}

const vm = new Vue({
    data: {
        socketID: "",
        message: "",
        nickname: "",
        messages: []
    },

    methods: {
        dispatchMessage() {
            console.log('Handle emit message');

            socket.emit('chat_message', { 
                content: this.message,
                name: this.nickname || "anonymous"
            })

            this.message = "";
        }
    },

    mounted: function() {
        console.log('Vue done mounting');
    },

    components: {
        newmessage: ChatMessage
    }
}).$mount("#app");

socket.addEventListener('connected', setUserId);
socket.addEventListener('disconnect', showDisconnectMessage);
socket.addEventListener('new_message', appendMessage);
