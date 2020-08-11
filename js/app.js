var form = document.getElementById('todoform');
var todoItems = document.getElementById('todoList');
var todo = document.getElementById('todo');
var todoHeading = document.getElementById('todoHeading')
var editField = document.getElementById('updateTodoValue');

getfirebaseData = () => {
    firebase.database().ref('todos').on('value', (snapshots) => {
        var object = snapshots.val();
        console.log(object.name)
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const element = object[key];
                var listItem = `<li class="list-group-item" id=${element.key}> ${element.name}<button class="btn btn-danger right" onclick="deleteTodo('${element.key}')">Delete</button>
                <button class="btn btn-default default right"
                onclick="editTodo('${element.key}')" data-toggle="modal" data-target="#centralModalSuccess">Edit</button></li>`;
                todoItems.innerHTML += listItem;
            }
        }
    })
}

getfirebaseData();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (todo.value !== '') {
        var keys = firebase.database().ref('todos').push().key;
        var todosItem = {
            name: todo.value,
            key: keys
        }
        firebase.database().ref('todos/' + keys).set(todosItem)
        todo.value = '';
        todoHeading.style.display = 'block';

    }
})


deleteAllTodo = () => {
    todoItems.innerHTML = '';
    todoHeading.style.display = 'none';
    firebase.database().ref('todos').remove();
}
deleteTodo = (key) => {
    firebase.database().ref('todos/' + key).remove();
}

function editTodo(key) {
    var object;
    firebase.database().ref('todos/' + key).once('value', (snapshots) => {
           object = snapshots.val();
           editField.value = object.name;     
           sessionStorage.setItem('id', object.key);
    })
}

function updatetodo(key) {
    var key =  sessionStorage.getItem('id')
    firebase.database().ref('todos/' + key).set({
        name : editField.value,
        key : key
    })
    sessionStorage.removeItem('id')
}