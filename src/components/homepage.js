import React, { useState, useEffect } from "react";
import { Progress } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import MenuforHomepage from "./menu.js";
import { Button, Input, Switch } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  AudioOutlined,
  SearchOutlined,
  CheckOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";

const { Search } = Input;

const twoColors = { '0%': '#108ee9', '100%': '#87d068' };
const conicColors = { '0%': '#87d068', '50%': '#ffe58f', '100%': '#ffccc7' };

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [voiceRecognitionResult, setVoiceRecognitionResult] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [tempuidd, setTempuidd] = useState("");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser.uid}`), (Snapshot) => {
          setTodos([]);
          const data = Snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((OldArray) => [...OldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, [navigate, voiceRecognitionResult]);

  const calculateProgress = () => {
    const totalTodos = todos.length;
    const completedTodos = todos.filter((todo) => todo.status === "done").length;
    return totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  };

  const writeTodoDatabase = () => {
    if (todo.trim() !== "") {
      const uidd = uid();
      set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
        todo: todo,
        uidd: uidd,
        status: "active",
        checked: false,
      });
      setTodo("");
    }
  };

  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`))
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.uidd !== uid));
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  const handleUpdate = (todo) => {
    setIsEditingMode(true);
    setTodo(todo.todo);
    setTempuidd(todo.uidd);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempuidd}`), {
      todo: todo,
      tempuidd: tempuidd,
    });
    setTodo("");
    setIsEditingMode(false);
  };

  const handleVoiceRecognition = () => {
    setIsEditingMode(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceRecognitionResult(transcript);
    };
    recognition.start();
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const handleStatusChange = (uid, checked) => {
    const newStatus = checked ? "done" : "active";
    update(ref(db, `/${auth.currentUser.uid}/${uid}`), {
      status: newStatus,
    });
  };

  const filteredTodos = todos.filter((todo) =>
    (todo && todo.todo && todo.todo.toLowerCase().includes(searchText.toLowerCase())) || false
  );

  return (
    <div className="homepage">
      <div className="menu-left">
        <MenuforHomepage />
      </div>
      <div className="content-right-homepage">
        <div className="search-div-header">
          <h3>Notes</h3>
        </div>

        <div className="homepage-adding-div">
          <div className="adding-searching-header">
            <Input
              className="add-todo-input"
              type="text"
              value={todo || voiceRecognitionResult}
              placeholder="add todo"
              onChange={(e) => setTodo(e.target.value)}
              style={{ color: "black" }} 
            />
            {isEditingMode ? (
              <>
                <CheckOutlined onClick={handleEditConfirm} />
                <CloseOutlined onClick={() => setIsEditingMode(false)} />
              </>
            ) : (
              <>
                <PlusOutlined onClick={writeTodoDatabase} />
                <AudioOutlined onClick={handleVoiceRecognition} />
              </>
            )}
            <Input
              placeholder="Search"
              className="searchInput"
              value={searchText}
              onChange={(e) => onSearch(e.target.value)}
              suffix={
                <Button
                  type="text"
                  icon={
                    <SearchOutlined
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#6B5DB0",
                      }}
                    />
                  }
                />
              }
            />
          </div>
        </div>

        <AnimatePresence>
          <div className="notes-container">
            {filteredTodos.map((todo) => (
              <motion.div
                className={`notes-div ${todo.status === "done" ? "done" : ""}`}
                key={todo.uidd}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="notes-div-inside">
                  <div className="switchDiv">
                    <Switch
                      checked={todo.status === "done"}
                      onChange={(checked) =>
                        handleStatusChange(todo.uidd, checked)
                      }
                      className="switch-activeDone"
                    />
                  </div>
                  <h4
                    style={{
                      textDecoration: todo.checked ? "line-through" : "none",
                      opacity: todo.status === "done" ? 0.3 : 1,
                     
                    }}
                  >
                    {todo.todo}
                  </h4>

                  <div className="editAndDeleteDiv">
                    <EditOutlined
                      style={{ fontSize: '20px' }}
                      onClick={() => handleUpdate(todo)}
                    />
                    <DeleteOutlined
                      style={{ fontSize: '20px' }}
                      onClick={() => handleDelete(todo.uidd)}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <div className="progress-container">
          <Progress percent={calculateProgress()} status="active" strokeColor={conicColors} />
        </div>
      </div>
    </div>
  );
}
