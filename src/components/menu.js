
import React from "react";
import { HomeFilled, CalendarFilled, SnippetsFilled,RightSquareFilled,MehFilled  } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth} from "../firebase.js";


export default function MenuforHomepage() {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="menu2-div">
      <div className="menu2-div-inside" onClick={() => handleButtonClick('/homepage')}>
        <HomeFilled className="menu-icon" style={{ fontSize: "25px"}} />
      </div>
      <div className="menu2-div-inside" onClick={() => handleButtonClick('/conspects')}>
        <SnippetsFilled  className="menu-icon" style={{ fontSize: "25px"}} />
      </div>
     
      
      <div className="menu2-div-inside"  onClick={handleSignOut}>
        < RightSquareFilled  className="menu-icon" style={{ fontSize: "25px"}} />
      </div>
      <div className="men2-div-inside" onClick={()=>handleButtonClick('/ContactMe')}>
      <MehFilled   className="menu-icon" style={{fontSize:'25px'}} />
      </div>
      </div>
   
  );
}
