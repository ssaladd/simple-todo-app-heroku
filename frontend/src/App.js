import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        todoList:[],
        activeItem:{
          id:null, 
          title:'',
          completed:false,
          priority:0,
        },
        editing:false,
        textvalue:"Create",
      }
      this.fetchTasks = this.fetchTasks.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.getCookie = this.getCookie.bind(this)
      this.startEdit = this.startEdit.bind(this)
      this.deleteItem = this.deleteItem.bind(this)
      this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentWillMount()
  {
    this.fetchTasks()
  }

  fetchTasks()
  {
    console.log('Fetching...')

    fetch('http://127.0.0.1:8000/api/task-list/')
    .then(response => response.json())
    .then(data => 
      this.setState({
        todoList:data
      })
    )
  }

  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken')
    var url = 'http://127.0.0.1:8000/api/task-create/'
    if(this.state.editing == true){
      url = `http://127.0.0.1:8000/api/task-update/${ this.state.activeItem.id}/`
      this.setState({
        editing:false
      })
    }

    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response)  => {
        this.fetchTasks()
        this.setState({
           activeItem:{
          id:null, 
          title:'',
          completed:false,
        }
        })
    }).catch(function(error){
      console.log('ERROR:', error)
    })

  }

  startEdit(task){
    this.setState({
      activeItem:task,
      editing:true,
      textvalue:'edit',
    })
  }

  deleteItem(task){
    var csrftoken = this.getCookie('csrftoken')

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((response) =>{

      this.fetchTasks()
    })
  }

  strikeUnstrike(task){
    task.completed = !task.completed
    var csrftoken = this.getCookie('csrftoken')
    var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`

      fetch(url, {
        method:'POST',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'completed': task.completed, 'title':task.title})
      }).then(() => {
        this.fetchTasks()
      })

    console.log('TASK:', task.completed)
  }

  render(){
    var tasks = this.state.todoList
    var self = this
    var buttontext = ["Create","edit"]
    return(
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <h1>a simple todo app</h1>
            <p>made with django, reactjs and sqlite</p>
            <form onSubmit={this.handleSubmit}  id="form">
                <div className="flex-wrapper">
                    <div id="input-container">
                      <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task.." />
                      <div id="other-input">  
                        <div id="date-container">
                          <input className="form-control" id="date"  type="text" name="month" placeholder="due date" />
                        </div>
                        <div id="priority-container">
                          <div id="lo" className="form-control"> <p>lo</p><input    type="radio" name="priority" placeholder="lo" /></div>
                          <div id="mid" className="form-control"> <p>mid</p><input  id="mid"   type="radio" name="priority" placeholder="mid" /></div>
                          <div id="hi" className="form-control"> <p>hi</p><input  id="hi"   type="radio" name="priority" placeholder="hi" /></div>
                        </div>
                      </div>
                    </div>
                    <button id="submit" className="btn" type="submit" name="Add" onClick={() => this.setState({textvalue:"Create"})}>{this.state.textvalue}</button>
                </div>
            </form>
          </div>
          <div  id="list-wrapper">         
            {tasks.map(function(task, index) {
              return(
                  <div key={index} className="task-wrapper flex-wrapper">
                    <div id="priority">
                      {task.priority}
                    </div>
                    <div onClick={() => self.strikeUnstrike(task)} id="textarea">
                        {task.completed == false ? (
                            <span>{task.title}</span>
                          ) : (
                            <strike>&nbsp;&nbsp;{task.title}&nbsp;&nbsp;</strike>
                          )}
                    </div>
                    <div id="buttons">
                      <div >
                          <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                      </div>
                      <div >
                          <button onClick={() => self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">Delete</button>
                      </div>
                    </div>
                  </div>
                )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
