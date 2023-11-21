import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import { Input } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import { AnimatePresence, motion } from "framer-motion";
import MenuforHomepage from "./menu.js";

export default function Conspects() {
  const [conspect, setConspect] = useState("");
  const navigate = useNavigate();
  const [conspects, setConspects] = useState([]);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [tempuidd, setTempuidd] = useState();
  const [conspectsCount, setConspectsCount] = useState(0);

  
useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser.uid}/conspects`), (Snapshot) => {
          const data = Snapshot.val();
          if (data !== null) {
            setConspectsCount(Object.values(data).length);
  
            // Обновляем conspects после установки conspectsCount
            setConspects(Object.values(data).map((conspect) => conspect));
          } else {
            // Если данных нет, обнуляем conspectsCount и массив conspects
            setConspectsCount(0);
            setConspects([]);
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, [navigate]);

  const writeConspectDatabase = () => {
    if (conspect.trim() !== "") {
      const uidd = uid();
      set(ref(db, `/${auth.currentUser.uid}/conspects/${uidd}`), {
        conspect: conspect,
        uidd: uidd,
      });
      setConspect("");
    }
  };

  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/conspects/${uid}`));
  };

  const handleUpdate = (conspect) => {
    setIsEditingMode(true);
    setConspect(conspect.conspect);
    setTempuidd(conspect.uidd);
  };

  const handeEditConfirm = () => {
    if (tempuidd) {
      update(ref(db, `/${auth.currentUser.uid}/conspects/${tempuidd}`), {
        conspect: conspect,
        tempuidd: tempuidd,
      });
      setConspect("");
      setIsEditingMode(false);
    }
  };

  return (
    <div className="conspects">
      <div className="menu-left-csnects">
        <MenuforHomepage />
      </div>
      <div className="content-right-conspects">
        <p className="conspects-p">Conspects</p>
        <div className="conspects-adding-div">
          <Input
            className="add-conspect-input"
            type="text"
            value={conspect}
            placeholder="add conspect"
            onChange={(e) => setConspect(e.target.value)}
          />

          <div className="icons-container">
            {isEditingMode ? (
           <CheckOutlined   className="confirm-button" onClick={handeEditConfirm}/>
            ) : (
            <PlusOutlined  onClick={writeConspectDatabase} />
            )}
          </div>
        </div>
        <AnimatePresence>
          {conspects && conspects.length > 0 && conspects.map((conspect) => (
            <motion.div
              className="notes-div-conspects"
              key={conspect.uidd}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="notes-div-inside-conspects">
                <h4>{conspect.conspect}</h4>
             <EditOutlined  className="update-button" onClick={() => handleUpdate(conspect)}/>
             <DeleteOutlined className="delete-button" onClick={() => handleDelete(conspect.uidd)} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
    </div>
  );
}