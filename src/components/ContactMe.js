import React from "react";
import MenuforHomepage from "./menu";
import { UserOutlined, InstagramOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Avatar } from "antd";

export default function ContactMe() {
  const instagramIconStyle = {
    color: 'white',
    fontSize: '24px',
  };

  return (
    <div className="ContactMe">
      <div className="ContactMe-left">
        <MenuforHomepage />
      </div>
      <div className="ContactMe-right">
        <div className="contactMe-main">
          <Avatar size={120} icon={<UserOutlined />} />
          <div><p className="name-p">Lilith Galstyan</p></div>
          <div className="Contact-info">
            <InstagramOutlined style={instagramIconStyle} /> Instagram: lillliiith
          </div>
          <div>
            <MailOutlined style={instagramIconStyle} /> galstanlilith365@gmail.com
          </div>
          <div>
            <PhoneOutlined style={instagramIconStyle} /> +37498037763
          </div>
        </div>
      </div>
    </div>
  )
}
