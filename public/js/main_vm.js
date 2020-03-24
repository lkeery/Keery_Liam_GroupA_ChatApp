// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

function setUserId({sID, connections}) {
    console.log(sID);
    vm.socketID = sID;
    vm.connections = connections;
}

function showDisconnectMessage() {
    console.log('A user disconnected')
}

function appendMessage(message) {
    vm.messages.push(message);
}

function showTyping({msg}){
    let ui = document.querySelector('.user-typing');
    let msgArea = document.querySelector('.typing-msg')

    console.log(vm.typing);

    if (vm.typing === true) {
        ui.style.display = "block";
        msgArea.innerHTML = msg;
    } else {
        ui.style.display = "none";
    }
    

}

const vm = new Vue({
    data: {
        socketID: "",
        message: "",
        nickname: "",
        messages: [],
        connections: null,
        typing: false,
        msg: ""
    },

    methods: {
        dispatchMessage() {
            //console.log('Handle emit message');

            socket.emit('chat_message', { 
                content: this.message,
                name: this.nickname || "Anonymous chatr"
            })

            this.message = "";
        },

        captureKeyStroke() {

            if (!this.typing) {
                socket.emit('typing', {
                name: this.nickname || "Anonymous chatr",
                typing: true
                })
            }

            this.typing=true;
        },

        releaseKeyStrokes() {

            this.typing=false;

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
socket.addEventListener('notifyTyping', showTyping);
