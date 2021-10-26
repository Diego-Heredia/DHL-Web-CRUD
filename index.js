
const db = firebase.firestore();

// console.log("Holi");
const taskForm = document.getElementById("task-form");
const taskContainer = document.getElementById("task-container");

let editStatus = false;
let id = '';

const saveTask = (title,description) =>{

    db.collection('tasks').doc().set({
       title,
       description
    });
}


const getTask = ()=> db.collection('tasks').get();
// const onGetTasks = () => db.collection('tasks').onSnapshot(doc);
const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);
const deleteTask = (id) => db.collection("tasks").doc(id).delete();

const getTask_e = (id) => db.collection("tasks").doc(id).get()

const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);


window.addEventListener('DOMContentLoaded', async (e)=>{
    // const querySnapshot = await getTask();


    onGetTasks((querySnapshot)=>{
        taskContainer.innerHTML = '';
        querySnapshot.forEach(doc => {
            
            console.log(doc.data());
    
            const task = doc.data();


            taskContainer.innerHTML += `
            <div class="card card-body mt-2 border-primary">
            <h3>${task.title}</h3>
        <p>${task.description}</p>
        <div>
        <button class="btn btn-primary btn-delete" data-id="${doc.id}">Delete</button>
        <button class="btn btn-secondary btn-edit" data-id="${doc.id}">Edit</button>
    
    </div>
            
            </div>
    
            
            `;
            const btnsDelete = taskContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );
            const btnsEdit = taskContainer.querySelectorAll(".btn-edit");
            btnsEdit.forEach((btn) => {
                btn.addEventListener("click", async (e) => {
                  try {
                    const doc = await getTask_e(e.target.dataset.id);
                    const task = doc.data();
                    taskForm["task-title"].value = task.title;
                    taskForm["task-description"].value = task.description;
          
                    editStatus = true;
                    id = doc.id;
                    taskForm["btn-task-form"].innerText = "Update";
          
                  } catch (error) {
                    console.log(error);
                  }


                });

        
            });

        });
    });
});

taskForm.addEventListener("submit", async (e) =>{
    e.preventDefault();
    
    const Title =taskForm['task-title'];
    const Description =taskForm['task-description'];

    try {
        if (!editStatus) {
          await saveTask(Title.value, Description.value);
        } else {
          await updateTask(id, {
            title: Title.value,
            description: Description.value,
          })
    
          editStatus = false;
          id = '';
          taskForm['btn-task-form'].innerText = 'Save';
        }

    // await saveTask(Title.value,Description.value);
    // console.log(response);
    taskForm.reset();
    Title.focus();
} catch (error) {
    console.log(error);
  }
    // console.log(Title + Description);
    // console.log("enviado");
});


