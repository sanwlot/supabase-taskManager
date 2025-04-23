import { useEffect, useState } from 'react'
import { supabase } from '../supabase-client'

export default function TaskManager({ session }) {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
  })
  const [newDescription, setNewDescription] = useState('')
  const [tasks, setTasks] = useState([])
  const [taskImage, setTaskImage] = useState(null)

  async function uploadImage(file) {
    const filePath = `${file.name}-${Date.now()}`

    const { error } = await supabase.storage
      .from('task-imgs')
      .upload(filePath, file)

    if (error) {
      console.error('Error uploading image:', error.message)
      return null
    }

    const { data } = await supabase.storage
      .from('task-imgs')
      .getPublicUrl(filePath)

    return data.publicUrl
  }
  async function handleSubmit(e) {
    e.preventDefault()

    let imgUrl = null
    if (taskImage) {
      imgUrl = await uploadImage(taskImage)
    }

    const { error } = await supabase
      .from('tasks')
      .insert({ ...newTask, email: session.user.email, img_url: imgUrl })
      .select()
      .single()

    if (error) {
      console.error('Error inserting task:', error.message)
    }

    fetchTasks()

    setNewTask({
      title: '',
      description: '',
    })
  }
  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error.message)
    } else {
      console.log('Tasks fetched successfully:', data)
      setTasks(data)
    }
  }
  async function handleDelete(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      console.error('Error deleting task:', error.message)
    } else {
      console.log('Task deleted successfully')
      fetchTasks()
    }
  }
  async function handleEdit(id) {
    const { error } = await supabase
      .from('tasks')
      .update({ description: newDescription })
      .eq('id', id)

    if (error) {
      console.error('Error updating task:', error.message)
    } else {
      console.log('Task updated successfully')
      fetchTasks()
    }
  }
  function handleImageChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0])
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])
  return (
    <>
      <form onSubmit={handleSubmit} className="task-form">
        <h1>TASK MANAGER CRUD</h1>
        <div className="form-group">
          <label htmlFor="task">Task</label>
          <input
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            type="text"
            id="task"
            name="task"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            type="text"
            id="description"
            name="description"
            required
          />
        </div>
        {/* image file input */}
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
            id="image"
            name="image"
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <h2 className="task-title">{task.title}</h2>
            <p className="task-description">{task.description}</p>
            <img src={task.img_url} alt={task.title} width={100} />
            <div>
              <input
                onChange={(e) => setNewDescription(e.target.value)}
                type="text"
                placeholder="Edit task"
              />
              <button onClick={() => handleEdit(task.id)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
