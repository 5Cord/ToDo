import React, { useState } from 'react';
import styled from 'styled-components';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [editInputText, setEditInputText] = useState('');
  const [filter, setFilter] = useState('all');

  const addTask = (event) => {
    event.preventDefault();
    setTasks((task) => [...task, { id: crypto.randomUUID(), textTask: inputText, status: false }]);
    setInputText('');
  };

  const handleChangeInput = (event) => {
    setInputText(event.target.value);
  };

  const handleChangeEditInput = (event) => {
    setEditInputText(event.target.value);
  };

  const toggleTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: !task.status } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    // Фильтруем массив, оставляя только те задачи, у которых ID не равен taskId
    // Метод фильтр возрвщает все те, элементы которые удволетворяют условию в коллбеке
    // В нашем случае, в колбеке мы сравниваем ИД того жлемент на которй нажали со всеми
    // И получается так, что мы возвращаем все кроме того на который нажали (возвращаем все те которые не равны ИД на который нажали)
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // const deleteTask = (taskIndex) => {
  //   const copyArray = [...tasks];
  //   copyArray.splice(taskIndex, 1);
  //   setTasks(copyArray);
  // };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.status;
    if (filter === 'incomplete') return !task.status;
    return true; // 'all'
  });

  const startEditing = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId)
    setEditInputText(taskToEdit.textTask)
    setEditTaskId(taskId);// Устанавливаем ID задачи, которую редактируем
  };

  const saveEditing = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, textTask: editInputText } : task
      )
    );
    setEditTaskId(null);
    setEditInputText('')
  };

  return (
    <Container>
      <Form onSubmit={addTask}>
        <Input
          onChange={handleChangeInput}
          type="text"
          value={inputText}
          placeholder="Введите задачу"
        />
        <AddButton type="submit">Добавить</AddButton>
      </Form>
      <FilterContainer>
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          Все
        </FilterButton>
        <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')}>
          Выполненные
        </FilterButton>
        <FilterButton active={filter === 'incomplete'} onClick={() => setFilter('incomplete')}>
          Невыполненные
        </FilterButton>
      </FilterContainer>
      <TaskList>
        {filteredTasks.map((item) => (
          <TaskItem key={item.id} completed={item.status}>
            {editTaskId === item.id ? (
              <EditInput
                type="text"
                defaultValue={item.textTask}
                onChange={handleChangeEditInput}
              />
            ) : (
              <TaskText>{item.textTask}</TaskText>
            )}
            <Checkbox
              type="checkbox"
              checked={item.status}
              onChange={() => toggleTaskStatus(item.id)}
            />
            {editTaskId === item.id ? (
              <SaveButton onClick={() => saveEditing(item.id)}>Сохранить</SaveButton>
            ) : (
              <EditButton onClick={() => startEditing(item.id)}>Редактировать</EditButton>
            )}
            <DeleteButton onClick={() => deleteTask(item.id)}>Удалить</DeleteButton>
            {/* <button onClick={() => deleteTask(index)}>Удалить</button> */}
          </TaskItem>
        ))}
      </TaskList>
    </Container>
  );
}

export default App;

// Styled Components

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Form = styled.form`
  display: flex;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const FilterButton = styled.div`
  padding: 10px 20px;
  font-size: 16px;
  background-color: ${(props) => (props.active ? '#007bff' : '#6c757d')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: ${(props) => (props.active ? '#0056b3' : '#5a6268')};
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${(props) => (props.completed ? '#c2ffd0' : '#f8f9fa')};
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TaskText = styled.span`
  flex: 1;
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const EditInput = styled.input`
  flex: 1;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const EditButton = styled.button`
  display: ${(props) => (props.completed ? 'none' : 'flex')};
  padding: 5px 10px;
  font-size: 14px;
  background-color: #0755ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #0777ff;
  }
`;

const SaveButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #28a731;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;