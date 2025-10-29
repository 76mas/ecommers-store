"use client";

import { useEffect, useState } from "react";
import { Card, Avatar, Button, Empty, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Container from "@/app/components/container";

const Settings = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    message.success("تم تسجيل الخروج بنجاح");
    router.push("/");
  };

  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-bold mb-6">الملف الشخصي 👤</h1>

        {user ? (
          <Card className="max-w-md mx-auto text-center shadow-md">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              src={user.image}
              className="mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>

            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              تسجيل الخروج
            </Button>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Empty description="لم يتم تسجيل الدخول بعد" />
            <Button
              type="primary"
              className="mt-5"
              onClick={() => router.push("/login")}
            >
              تسجيل الدخول
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Settings;
