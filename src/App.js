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
          date:'',
        },
        editing:false,
        textvalue:"Create",
        radioChecked1:false,
        radioChecked2:false,
        radioChecked3:false,
        infotext:'create a task by filling in a name, a due date and choosing a priority level',
        throwhelp:false,
        helpstatus:true,
      }
      this.fetchTasks = this.fetchTasks.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleDateChange = this.handleDateChange.bind(this)
      this.handlePriorityChange1 = this.handlePriorityChange1.bind(this)
      this.handlePriorityChange2 = this.handlePriorityChange2.bind(this)
      this.handlePriorityChange3 = this.handlePriorityChange3.bind(this)
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

    fetch('https://simple-todo-app-django-react.herokuapp.com/api/task-list/')
    .then(response => response.json())
    .then(data => 
      this.setState({
        todoList:data
      })
    )
    console.log('fetch done')
    console.log(this.state.todoList)
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

  handleDateChange(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        date:value,
      }
    })
  }

  handlePriorityChange1(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        priority:value,
      }
    })

    if(e.target.checked && !this.state.radioChecked1){
      this.setState({
          radioChecked1:true,
      })
    }
    else if(e.target.checked && this.state.radioChecked1){
      this.setState({
          radioChecked1:false,
      })
    }
  }

  handlePriorityChange2(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        priority:value,
      }
    })

    if(e.target.checked && !this.state.radioChecked2){
      this.setState({
          radioChecked2:true,
      })
    }
    else if(e.target.checked && this.state.radioChecked2){
      this.setState({
          radioChecked2:false,
      })
    }
  }

  handlePriorityChange3(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        priority:value,
      }
    })

    if(e.target.checked && !this.state.radioChecked3){
      this.setState({
          radioChecked3:true,
      })
    }
    else if(e.target.checked && this.state.radioChecked3){
      this.setState({
          radioChecked3:false,
      })
    }
  }

  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)
    if (this.state.activeItem.date == '') {
      this.setState({
        infotext:'input a due date for your task in the date field and resubmit',
        throwhelp:true,
      })
      return;
    }
    if (this.state.activeItem.title == '') {
      this.setState({
        infotext:'input a name for your task in the name field and resubmit',
        throwhelp:true,
      })
      return;
    }
    if (this.state.helpstatus == true)
    {
      this.state.helpstatus=false
      console.log(this.state.helpstatus)
    }
    

    var csrftoken = this.getCookie('csrftoken')
    var url = 'https://simple-todo-app-django-react.herokuapp.com/api/task-create/'
    if(this.state.editing == true){
      url = `https://simple-todo-app-django-react.herokuapp.com/api/task-update/${ this.state.activeItem.id}/`
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
            date:'',
          },
          radioChecked1:false,
          radioChecked2:false,
          radioChecked3:false,
          helpstatus:false,
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

    fetch(`https://simple-todo-app-django-react.herokuapp.com/api/task-delete/${task.id}/`, {
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
    console.log('TASK:', task.completed)
    task.completed = !task.completed
    var csrftoken = this.getCookie('csrftoken')
    var url = `https://simple-todo-app-django-react.herokuapp.com/api/task-update/${task.id}/`

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
            <p>made with django, reactjs and postgresql</p>
            <form onSubmit={this.handleSubmit}  id="form">
                <div className="flex-wrapper">
                    <div id="input-container">
                      <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="add task.." />
                      <div id="other-input">  
                        <div id="date-container">
                          <input onChange={this.handleDateChange} className="form-control" id="date"  value={this.state.activeItem.date} type="text" name="date" placeholder="due date.." />
                        </div>
                        <div id="priority-container">
                          <div id="lo"  className="form-control"> 
                            <p>lo </p><input  id="lo"  type="radio" value="1" name="priority" placeholder="lo"  onClick={this.handlePriorityChange1} checked={this.state.radioChecked1}/></div>
                          <div id="mid" className="form-control"> 
                            <p>mid</p><input  id="mid" type="radio" value="2" name="priority" placeholder="mid" onClick={this.handlePriorityChange2} checked={this.state.radioChecked2}/></div>
                          <div id="hi"  className="form-control">
                            <p>hi </p><input  id="hi"  type="radio" value="3" name="priority" placeholder="hi"  onClick={this.handlePriorityChange3} checked={this.state.radioChecked3}/></div>
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
                    {
                      task.priority == 1 ? 
                      (
                        <div id="exclamation">
                            !
                        </div>
                      ) : ( 
                        task.priority == 2 ? 
                        (
                          <div id="exclamation">
                            !!
                          </div>
                        ) : (
                          task.priority == 3 ? 
                          (
                             <div id="exclamation">
                              !!!
                            </div>
                          ) : (
                            <div></div>
                          )
                        )
                      )
                    }    
                    </div>
                    <div onClick={() => self.strikeUnstrike(task)} id="textarea">
                        {task.completed == false ? (
                            <div>
                              <div id="task-title"><p>{task.title}</p></div>
                              <div id="task-date"><p>due {task.date}</p></div>
                            </div>
                          ) : (
                            <div>
                              <div id="task-title"><p><strike>&nbsp;&nbsp;{task.title}&nbsp;&nbsp;</strike></p></div>
                              <div id="task-date"><p>due {task.date}</p></div>
                            </div>
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
        <div id="footer">
           <div id={this.state.helpstatus ? "footer-area" : "hide"}>
              <p id={this.state.throwhelp ? "red" : "white"}>{this.state.infotext}</p>
           </div>
        </div>
      </div>
    )
  }
}

export default App;
