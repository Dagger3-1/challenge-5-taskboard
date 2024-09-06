// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || []; 
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if(nextId){
        nextId = nextId+1
    }else
    {
        nextId = 1
    }
    localStorage.setItem('nextId'.JSON.stringify(nextId));

}
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeletetask);

  
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

 
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);


  return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
        const taskList = readtaskListFromStorage();
      
        
        const todoList = $('#todo-cards');
        todoList.empty();
      
        const inProgressList = $('#in-progress-cards');
        inProgressList.empty();
      
        const doneList = $('#done-cards');
        doneList.empty();
      
        
        for (let task of taskList) {
          if (task.status === 'to-do') {
            todoList.append(createtaskCard(task));
          } else if (task.status === 'in-progress') {
            inProgressList.append(createtaskCard(task));
          } else if (task.status === 'done') {
            doneList.append(createtaskCard(task));
          }
        }
      
        $('.draggable').draggable({
          opacity: 0.7,
          zIndex: 100,
          
          helper: function (e) {
          
            const original = $(e.target).hasClass('ui-draggable')
              ? $(e.target)
              : $(e.target).closest('.ui-draggable');
           
            return original.clone().css({
              width: original.outerWidth(),
            });
          },
        });
      }

function handleAddTask(event){
        event.preventDefault();
      
        
        const taskName = taskNameInputEl.val().trim();
        const taskType = taskTypeInputEl.val(); 
        const taskDate = taskDateInputEl.val();
      
        const newtask = {
          
          name: taskName,
          type: taskType,
          dueDate: taskDate,
          status: 'to-do',
        };
      
    
        const tasks = readtasksFromStorage();
        tasks.push(newtask);
      
       
        savetasksToStorage(tasks);
      
    
        printtaskData();
      
    
        taskNameInputEl.val('');
        taskTypeInputEl.val('');
        taskDateInputEl.val('');
      }

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    
        const taskId = $(this).attr('data-task-id');
        const tasks = readtasksFromStorage();
      
        
        tasks.forEach((task) => {
          if (task.id === taskId) {
            tasks.splice(tasks.indexOf(task), 1);
          }
        });
      
      
        savetasksToStorage(tasks);
      
        
        printtaskData();
      }



// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    
        
        const task = readtaskFromStorage();
      
        
        const taskId = ui.draggable[0].dataset.tasksId;
      
        
        const newStatus = event.target.id;
      
        for (let tasks of task) {
          
          if (tasks.id === taskId) {
            tasks.status = newStatus;
          }
        }
        
        localStorage.setItem('task', JSON.stringify(task));
        printtasksData();
      }


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // ? Print project data to the screen on page load if there is any
    printProjectData();
  
    $('#taskDueDate').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  
    // ? Make lanes droppable
    $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
    });
  });
